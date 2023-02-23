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
export const setupTs = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);

	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:ts' });

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
			distributeFileInWorkspace(
				join(packageDirectory, 'static', `package-tsconfig${fileSuffix}.json`),
				'tsconfig.json',
				{
					...options,
					skipWorkspaceRoot: true,
					keywordCriteria: [`${packageJson.name}${fileSuffix}`],
					logger: logger.getSubLogger({ name: `packageTsConfig${loggerSuffix}` }),
				}
			),
			distributeFileInWorkspace(
				join(packageDirectory, 'static', 'package-tsconfig-vitest.json'),
				'tsconfig.spec.json',
				{
					...options,
					skipWorkspaceRoot: true,
					keywordCriteria: [`${packageJson.name}${fileSuffix}`],
					logger: logger.getSubLogger({ name: `packageTsConfig${loggerSuffix}-vitest` }),
				}
			),
		];
	};

	await Promise.all([
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					'lint:tsc': 'turbo run lint:tsc_ --concurrency 6 --filter ${packageName}',
					'lint:tsc_': 'tsc --noEmit',
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					'lint:tsc': 'turbo run lint:tsc_ --concurrency 6',
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'workspace-tsconfig.json'),
			'tsconfig.json',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'workspaceTsConfig' }),
			}
		),
		...forFlavour(), // base
		...forFlavour('node'),
		...forFlavour('web'),
		...forFlavour('svelte'),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};