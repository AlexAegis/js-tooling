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
export const setupEslint = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions({
		...rawOptions,
		dependencyCriteria: [packageJson.name],
	});
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
		...packageJson.name.split(posix.sep)
	);
	logger.info(`distributing config from ${packageDirectory}`);

	await Promise.all([
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
				logger: logger.getSubLogger({ name: 'packageJson' }),
			}
		),
		distributePackageJsonItemsInWorkspace(
			{
				scripts: {
					'lint:es': 'turbo run lint:es_ --concurrency 6',
				},
			},
			{
				...options,
				onlyWorkspaceRoot: true,
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
		await distributeFileInWorkspace(
			join(packageDirectory, 'static', 'package-eslintrc.cjs'),
			'.eslintrc.cjs',
			{
				...options,
				logger: logger.getSubLogger({ name: 'pacakgeEslintRc' }),
				skipWorkspaceRoot: true,
			}
		),
		await distributeFileInWorkspace(
			join(packageDirectory, 'static', 'workspace-eslintrc.cjs'),
			'.eslintrc.cjs',
			{
				...options,
				logger: logger.getSubLogger({ name: 'workspaceEslintRc' }),
				onlyWorkspaceRoot: true,
			}
		),
		await distributeFileInWorkspace(
			join(packageDirectory, 'static', 'workspace-eslintignore'),
			'.eslintignore',
			{
				...options,
				logger: logger.getSubLogger({ name: 'workspaceEslintIgnore' }),
				onlyWorkspaceRoot: true,
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
