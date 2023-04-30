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

export const distributeRemarkConfig = async (
	rawOptions?: DistributeInWorkspaceOptions
): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:remark' });

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
			join(packageDirectory, 'static', 'dot-remarkrc.js'),
			'.remarkrc.js',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'rc' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'dot-remarkignore'),
			'.remarkignore',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'ignore' }),
			}
		),
	]);

	// PackageJson edits must not be done concurrently with other packageJson edits!
	await distributePackageJsonItemsInWorkspace(
		{
			scripts: {
				'lint:md':
					'turbo run lint:md_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
				'lint:md_': 'remark --frail --no-stdout --silently-ignore *.md docs/**/*.md',
			},
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
				'lint:md': 'turbo run lint:md_ --concurrency 16 --cache-dir .cache/turbo',
				'lint:md_': 'remark --frail --no-stdout --silently-ignore *.md docs/**/*.md',
			},
			devDependencies: {
				'remark-cli': packageJson.devDependencies['remark-cli'],
				remark: packageJson.devDependencies.remark, // A local installation is required by the remark langauge server
			},
		},
		{
			...options,
			onlyWorkspaceRoot: true,
			dependencyCriteria: [packageJson.name],
			logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
		}
	);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
