import { join } from 'node:path/posix';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/fs.js';
import { getCurrentPackageRoot } from './get-current-package-root.function.js';

vi.mock('fs');

describe('getCurrentPackageRoot', () => {
	afterAll(() => {
		vi.resetAllMocks();
	});

	it('should find nothing when not in a workspace', () => {
		const result = getCurrentPackageRoot(join(mockProjectRoot, '..'));
		expect(result).toBeUndefined();
	});

	it('should find the workspace root when being directly in it', () => {
		const result = getCurrentPackageRoot(mockProjectRoot);
		expect(result).toEqual(mockProjectRoot);
	});

	it('should find the package directory when being directly inside in it', () => {
		const packageFolder = join(mockProjectRoot, 'packages', 'zed');
		const result = getCurrentPackageRoot(packageFolder);
		expect(result).toEqual(packageFolder);
	});

	it('should find the package directory when being deeper inside in it', () => {
		const packageFolder = join(mockProjectRoot, 'packages', 'zed');
		const result = getCurrentPackageRoot(join(packageFolder, 'src'));
		expect(result).toEqual(packageFolder);
	});
});
