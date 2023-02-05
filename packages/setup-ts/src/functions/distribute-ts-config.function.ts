import { createLogger } from '@alexaegis/logging';
import {
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
export const distributeTsConfig = async (
	rawOptions?: DistributeInWorkspaceOptions
): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions({
		...rawOptions,
		dependencyCriteria: [packageJson.name],
	});
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
				logger: logger.getSubLogger({ name: 'packageJson:workspace' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
