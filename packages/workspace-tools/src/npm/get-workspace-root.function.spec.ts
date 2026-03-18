import { join } from 'node:path/posix';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/fs.js';
import { getWorkspaceRoot } from './get-workspace-root.function.js';

vi.mock('fs');

describe('getWorkspaceRoot', () => {
	afterAll(() => {
		vi.resetAllMocks();
	});

	it('should find nothing when not in a workspace', () => {
		const foundPackageJsons = getWorkspaceRoot({ cwd: join(mockProjectRoot, '..') });
		expect(foundPackageJsons).toBeUndefined();
	});

	it('should find the workspace root when being directly in it', () => {
		const foundPackageJsons = getWorkspaceRoot({ cwd: mockProjectRoot });
		expect(foundPackageJsons).toEqual(mockProjectRoot);
	});

	it('should find the workspace root when being inside in it', () => {
		const foundPackageJsons = getWorkspaceRoot({ cwd: join(mockProjectRoot, 'packages') });
		expect(foundPackageJsons).toEqual(mockProjectRoot);
	});
});
