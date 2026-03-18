import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs/promises');
vi.mock('globby');
vi.mock('../lcov/merge-lcov-reports-in-workspace.function.js');

vi.mock('@alexaegis/workspace-tools', () => {
	return {
		getWorkspaceRoot: vi.fn(() => undefined),
	};
});

describe('mergeWorkspaceLcovReports outside a workspace', () => {
	const processExitSpy = vi.spyOn(process, 'exit').mockReturnValue(undefined as never);

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should exit immediately when outside of the workspace', async () => {
		await import('./merge-workspace-lcov-reports.js');

		expect(processExitSpy).toHaveBeenCalledWith(1);
	});
});
