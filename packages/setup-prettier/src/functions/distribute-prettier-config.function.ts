import { createLogger } from '@alexaegis/logging';
import {
	distributeFileInWorkspace,
	DistributeInWorkspaceOptions,
	getWorkspaceRoot,
	normalizeDistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import { join } from 'node:path';

/**
 * Links this packages prettierrc file to the root of the repo, and the ignore
 * file to every package
 */
export const distributePrettierConfig = async (
	rawOptions?: DistributeInWorkspaceOptions
): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'distribute:prettier' });

	if (!workspaceRoot) {
		console.warn("can't distribute prettier config, not in a workspace!");
		return;
	}

	const packageDirectory = join(workspaceRoot, 'node_modules', '@alexaegis', 'prettier');
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
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
