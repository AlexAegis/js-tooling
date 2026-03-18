import { createLogger } from '@alexaegis/logging';
import { getWorkspaceRoot } from '@alexaegis/workspace-tools';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { LCOV_INFO_FILE_NAME } from '../index.js';
import { mergeLcovReportsInWorkspace } from '../lcov/merge-lcov-reports-in-workspace.function.js';

const mergeWorkspaceLcovReports = async () => {
	const logger = createLogger({ name: 'merge-lcov' });
	const workspaceRoot = getWorkspaceRoot();

	logger.info('Starting mergeWorkspaceLcovReports');

	if (workspaceRoot) {
		const mergedLcov = await mergeLcovReportsInWorkspace({
			skipWorkspaceRoot: true,
			logger,
		});
		await mkdir(join(workspaceRoot, 'coverage'), { recursive: true });
		await writeFile(join(workspaceRoot, 'coverage', LCOV_INFO_FILE_NAME), mergedLcov);
	} else {
		logger.error('Not in a workspace!');
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
};

void (async () => {
	await mergeWorkspaceLcovReports();
})();
