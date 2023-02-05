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
export const distributePrettierConfig = async (
	rawOptions?: DistributeInWorkspaceOptions
): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions({
		...rawOptions,
		dependencyCriteria: [packageJson.name],
	});
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
		...packageJson.name.split(posix.sep)
	);
	logger.info(`distributing config from ${packageDirectory}`);

	const prettierIgnorePath = join(packageDirectory, 'static', '.prettierignore');
	const prettierrcPath = join(packageDirectory, 'static', '.prettierrc.cjs');

	await Promise.all([
		distributeFileInWorkspace(prettierrcPath, {
			...options,
			logger: logger.getSubLogger({ name: 'rc' }),
			onlyWorkspaceRoot: true,
		}),
		distributeFileInWorkspace(prettierIgnorePath, {
			...options,
			logger: logger.getSubLogger({ name: 'ignore' }),
		}),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					format: 'prettier --write .',
					'lint:format_': 'prettier --check .',
					'lint:format': 'turbo run lint:format_ --concurrency 6 --filter ${packageName}',
				},
			},
			{
				...options,
				skipWorkspaceRoot: true,
				logger: logger.getSubLogger({ name: 'packageJson' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					format: 'prettier --write .',
					// 'lint:format:workspace': undefined, // TODO: try this once core@0.0.11 is released
					'lint:format_': 'prettier --check *.{json,ts,js,mjs,md,yml,yaml}',
					'lint:format': 'turbo run lint:format_ --concurrency 6',
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
