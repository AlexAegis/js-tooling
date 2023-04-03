import { createLogger } from '@alexaegis/logging';
import {
	NODE_MODULES_DIRECTORY_NAME,
	distributeFileInWorkspace,
	getWorkspaceRoot,
	normalizeDistributeInWorkspaceOptions,
	type DistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import { join } from 'node:path';
import packageJson from '../../package.json';

export const setupGithub = async (rawOptions?: DistributeInWorkspaceOptions): Promise<void> => {
	const options = normalizeDistributeInWorkspaceOptions(rawOptions);
	const startTime = performance.now();
	const workspaceRoot = getWorkspaceRoot(options.cwd);
	const logger = createLogger({ name: 'setup:github' });

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
			join(packageDirectory, 'static', 'bug_report.yml'),
			join('.github', 'ISSUE_TEMPLATE', 'bug_report.yml'),
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'bug_report' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'feature_request.yml'),
			join('.github', 'ISSUE_TEMPLATE', 'feature_request.yml'),
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'feature_request' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'funding.yml'),
			join('.github', 'funding.yml'),
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'funding' }),
			}
		),
		distributeFileInWorkspace(
			join(packageDirectory, 'static', 'cicd.yml'),
			join('.github', 'workflows', 'cicd.yml'),
			{
				...options,
				onlyWorkspaceRoot: true,
				dependencyCriteria: [packageJson.name],
				logger: logger.getSubLogger({ name: 'cicd' }),
			}
		),
	]);

	logger.info(`finished in ${Math.floor(performance.now() - startTime)}ms`);
};
