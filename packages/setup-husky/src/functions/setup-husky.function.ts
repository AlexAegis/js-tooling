import { createLogger } from '@alexaegis/logging';
import {
	distributeFileInWorkspace,
	DistributeInWorkspaceOptions,
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
export const setupHusky = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'setup:husky' });

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
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'commit-msg'),
			join('.husky', 'commit-msg'),
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'commit-msg' }),
				markAsExecutable: true,
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'pre-commit'),
			join('.husky', 'pre-commit'),
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'pre-commit' }),
				markAsExecutable: true,
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
