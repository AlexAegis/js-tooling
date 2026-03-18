import { createMockLogger } from '@alexaegis/logging/mocks';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { mergeLcovReportsInWorkspace } from './merge-lcov-reports-in-workspace.function.js';

vi.mock('node:fs/promises');
vi.mock('globby');
vi.mock('./collect-lcov-report-paths.function.js');

describe('mergeLcovReportsInWorkspace', () => {
	const { logger } = createMockLogger(vi);

	afterAll(() => {
		vi.resetAllMocks();
	});

	it('should return paths of all lcov reports in the workspace except at the root', async () => {
		expect(await mergeLcovReportsInWorkspace({ logger })).toEqual(
			[
				'/foo/bar/packages/zed/coverage/lcov.info',
				'/foo/bar/packages/zod/coverage/lcov.info',
			].join('\n'),
		);
	});

	it('should not return any paths outside the workspace', async () => {
		expect(await mergeLcovReportsInWorkspace({ cwd: '/foo' })).toEqual([].join('\n'));
	});
});
