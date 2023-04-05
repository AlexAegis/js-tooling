import { createLogger } from '@alexaegis/logging';
import {
	NODE_MODULES_DIRECTORY_NAME,
	distributeFileInWorkspace,
	distributePackageJsonItemsInWorkspace,
	getWorkspaceRoot,
	normalizeDistributeInWorkspaceOptions,
	type DistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import { join } from 'node:path';
import packageJson from '../../package.json';

export const setupEslint = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:eslint' });

	if (!workspaceRoot) {
		console.warn("can't distribute config, not in a workspace!");
		return;
	}

	const packageDirectory = join(
		workspaceRoot,
		NODE_MODULES_DIRECTORY_NAME,
		...packageJson.name.split('/')
	);
	logger.info(`distributing config from ${packageDirectory}`);

	await distributeFileInWorkspace(
		join(packageDirectory, 'static', 'package-eslintrc.cjs'),
		'.eslintrc.cjs',
		{
			...options,
			skipWorkspaceRoot: true,
			keywordCriteria: [packageJson.name], // TODO: it would be nice to exclude all libs that are not covered by a specific eslint config and let this fallback only fall back when needed
			logger: logger.getSubLogger({ name: 'packageEslintRc' }),
		}
	);

	await Promise.allSettled([
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					'lint:es': 'turbo run lint:es_ --concurrency 6 --filter ${packageName}',
					'lint:es_': 'eslint --max-warnings=0 --fix --no-error-on-unmatched-pattern .',
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
					'lint:es': 'turbo run lint:es_ --concurrency 6',
				},
				devDependencies: {
					'@alexaegis/eslint-config-core':
						packageJson.devDependencies['@alexaegis/eslint-config-core'],
					eslint: packageJson.devDependencies.eslint,
					'@types/eslint': packageJson.devDependencies['@types/eslint'],
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),

		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'package-eslintrc-vitest.cjs'),
			'.eslintrc.cjs',
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name, /.*vitest.*/g],
				logger: logger.getSubLogger({ name: 'packageEslintRc' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'workspace-eslintrc.cjs'),
			'.eslintrc.cjs',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'workspaceEslintRc' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'eslintignore.txt'),
			'.eslintignore',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'workspaceEslintIgnore' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'eslintignore.txt'),
			'.eslintignore',
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'packageEslintIgnore' }),
			}
		),
	]);

	await distributePackageJsonItemsInWorkspace(
		{
			devDependencies: {
				'@alexaegis/eslint-config-vitest':
					packageJson.devDependencies['@alexaegis/eslint-config-vitest'],
			},
		},
		{
			...options,
			skipWorkspaceRoot: true,
			keywordCriteria: [packageJson.name, /.*vitest.*/g],
			logger: logger.getSubLogger({ name: 'packageJson' }),
		}
	);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
