import { createLogger, distribute, DistributeOptions, getWorkspaceRoot } from '@alexaegis/tools';
import { join } from 'node:path';

/**
 * Links this packages prettierrc file to the root of the repo, and the ignore
 * file to every package
 */
export const distributePrettierConfig = async (options?: DistributeOptions): Promise<void> => {
	const startTime = performance.now();
	const cwd = options?.cwd ?? process.cwd();
	const workspaceRoot = getWorkspaceRoot(cwd);
	const logger = createLogger({ prefix: 'distribute:prettier' });

	if (!workspaceRoot) {
		console.warn("can't distribute prettier config, not in a workspace!");
		return;
	}

	const packageDirectory = join(workspaceRoot, 'node_modules', '@alexaegis', 'prettier');
	const prettierIgnorePath = join(packageDirectory, 'static', '.prettierignore');
	const prettierrcPath = join(packageDirectory, 'static', '.prettierrc.cjs');

	await Promise.all([
		distribute(prettierrcPath, {
			...options,
			cwd,
			logger: createLogger({ prefix: 'distribute:prettierrc' }),
			onlyWorkspaceRoot: true,
		}),
		distribute(prettierIgnorePath, {
			...options,
			cwd,
			logger: createLogger({ prefix: 'distribute:prettierignore' }),
		}),
	]);

	logger.log(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
