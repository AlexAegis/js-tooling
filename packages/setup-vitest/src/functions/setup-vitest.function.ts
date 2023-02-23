import { createLogger } from '@alexaegis/logging';
import {
	distributeFileInWorkspace,
	DistributeInWorkspaceOptions,
	distributePackageJsonItemsInWorkspace,
	getWorkspaceRoot,
	NODE_MODULES_DIRECTORY_NAME,
	normalizeDistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import { join, posix } from 'node:path';
import packageJson from '../../package.json';

/**
 * Links this packages prettierrc file to the root of the repo, and the ignore
 * file to every package
 */
export const setupVitest = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:vitest' });

	if (!workspaceRoot) {
		console.warn("can't distribute config, not in a workspace!");
		return;
	}

	const packageDirectory = join(
		workspaceRoot,
		NODE_MODULES_DIRECTORY_NAME,
		...packageJson.name.split(posix.sep)
	);
	logger.info(`distributing config from ${packageDirectory}`);

	const forFlavour = (flavour?: string): Promise<void>[] => {
		const fileSuffix = flavour ? `-${flavour}` : '';
		const loggerSuffix = flavour ? `:${flavour}` : ':base';

		return [
			distributePackageJsonItemsInWorkspace(
				{
					scripts: {
						test: 'turbo run test_ --concurrency 6 --filter ${packageName}',
						test_: 'vitest --passWithNoTests --coverage --run',
						'test:watch': 'vitest --passWithNoTests --coverage --run',
					},
					devDependencies: {
						['@alexaegis/vitest']: packageJson.devDependencies['@alexaegis/vitest'],
					},
				},
				{
					...options,
					skipWorkspaceRoot: true,
					keywordCriteria: [`${packageJson.name}${fileSuffix}`],
					logger: logger.getSubLogger({ name: 'packageJson' }),
				}
			),
			distributeFileInWorkspace(
				join(packageDirectory, 'static', `package${fileSuffix}-vitest.config.ts`),
				'vitest.config.ts',
				{
					...options,
					skipWorkspaceRoot: true,
					keywordCriteria: [`${packageJson.name}${fileSuffix}`],
					logger: logger.getSubLogger({ name: `packageVitestConfig${loggerSuffix}` }),
				}
			),
		];
	};

	await Promise.all([
		...forFlavour('node'),
		...forFlavour('web'),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					test: 'turbo run test_ --concurrency 6 && merge-workspace-lcov-reports && lcov-viewer lcov -o ./coverage ./coverage/lcov.info',
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};