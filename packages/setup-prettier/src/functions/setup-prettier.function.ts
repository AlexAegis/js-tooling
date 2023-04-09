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

export const distributePrettierConfig = async (
	rawOptions?: DistributeInWorkspaceOptions
): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:prettier' });

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

	await Promise.all([
		distributeFileInWorkspace(
			join(packageDirectory, 'static', '.prettierrc.cjs.txt'),
			'.prettierrc.cjs',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'rc' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', '.prettierignore'),
			'.prettierignore',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'ignore' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', '.prettierignore'),
			'.prettierignore',
			{
				...options,
				skipWorkspaceRoot: true,
				keywordCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'ignore' }),
			}
		),
	]);

	// PackageJson edits must not be done concurrently with other packageJson edits!
	await distributePackageJsonItemsInWorkspace(
		{
			scripts: {
				format: 'prettier --write .',
				'lint:format_': 'prettier --check .',
				'lint:format':
					'turbo run lint:format_ --concurrency 6 --cache-dir .cache/turbo --filter ${packageName}',
			},
			dependencies: {},
		},
		{
			...options,
			skipWorkspaceRoot: true,
			keywordCriteria: [packageJson.name],
			logger: logger.getSubLogger({ name: 'packageJson' }),
		}
	);

	// PackageJson edits must not be done concurrently with other packageJson edits!
	await distributePackageJsonItemsInWorkspace(
		{
			scripts: {
				format: 'prettier --write .', // Not done through turbo, it covers the entire repo anyway
				'lint:format:workspace': undefined,
				'lint:format_': 'prettier --check *.{json,ts,js,mjs,md,yml,yaml}',
				'lint:format': 'turbo run lint:format_ --concurrency 6 --cache-dir .cache/turbo',
			},
			devDependencies: {
				prettier: packageJson.dependencies.prettier,
			},
		},
		{
			...options,
			onlyWorkspaceRoot: true,
			logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
		}
	);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
