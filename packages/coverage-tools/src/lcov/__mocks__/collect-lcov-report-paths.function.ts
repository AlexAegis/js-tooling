import type { CollectWorkspacePackagesOptions } from '@alexaegis/workspace-tools';
import { mockProjectRoot } from '../../../__mocks__/globby.js';

export const collectLcovReportPaths = (rawOptions?: CollectWorkspacePackagesOptions): string[] => {
	const defaultCwd = mockProjectRoot;
	const cwd = rawOptions?.cwd ?? defaultCwd;

	return cwd.startsWith(mockProjectRoot)
		? ['/foo/bar/packages/zed/coverage/lcov.info', '/foo/bar/packages/zod/coverage/lcov.info']
		: [];
};
