import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs/promises');
vi.mock('globby');
vi.mock('../lcov/merge-lcov-reports-in-workspace.function.js');

vi.mock('@alexaegis/workspace-tools', () => {
	return {
		getWorkspaceRoot: vi.fn(() => '/foo/bar'),
	};
});

describe('mergeWorkspaceLcovReports inside a workspace', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should call', async () => {
		const mod = await import('./merge-workspace-lcov-reports.js');

		expect(mod).toBeDefined();
	});
});
