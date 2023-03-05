import { createLogger } from '@alexaegis/logging';
import {
	distributeFileInWorkspace,
	DistributeInWorkspaceOptions,
	getWorkspaceRoot,
	NODE_MODULES_DIRECTORY_NAME,
	normalizeDistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import { join } from 'node:path';
import packageJson from '../../package.json';

export const setupStylelint = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'setup:stylelint' });

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
			join(packageDirectory, 'static', 'dot-stylelintrc.cjs'),
			'.stylelintrc.cjs',
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'stylelintrc' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
