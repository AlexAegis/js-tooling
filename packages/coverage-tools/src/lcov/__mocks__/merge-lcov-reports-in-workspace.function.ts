import type { CollectWorkspacePackagesOptions } from '@alexaegis/workspace-tools';

export const mergeLcovReportsInWorkspace = (
	_rawOptions?: CollectWorkspacePackagesOptions,
): string => {
	return 'lcov';
};
