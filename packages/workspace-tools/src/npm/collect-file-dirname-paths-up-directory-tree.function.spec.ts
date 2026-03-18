import { join } from 'node:path/posix';
import { describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/fs.js';
import { PACKAGE_JSON_NAME } from '../index.js';
import { collectFileDirnamePathsUpDirectoryTree } from './collect-file-dirname-paths-up-directory-tree.function.js';

vi.mock('fs');

describe('collectFileDirnamePathsUpDirectoryTree', () => {
	describe('cwd', () => {
		it('should find nothing when not in a workspace', () => {
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: '/foo',
			});
			expect(result).toEqual([]);
		});

		it('should be able to return the root of the workspace from the root', () => {
			const testPath = mockProjectRoot;
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: testPath,
			});
			expect(result).toEqual([mockProjectRoot]);
		});

		it('should be able to walk from zed', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zed');
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: testPath,
			});
			expect(result).toEqual([mockProjectRoot, testPath]);
		});

		it('should be able to walk from zod', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod');
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: testPath,
			});
			expect(result).toEqual([mockProjectRoot, testPath]);
		});
	});

	describe('depth', () => {
		it('should not find anything if the depth is smaller than how deep you start in the package', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod', 'a', 'b');
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: testPath,
				depth: 1,
			});
			expect(result).toEqual([]);
		});

		it('should not find the workspace root if the depth only reaches the inner package', () => {
			const packagePath = join(mockProjectRoot, 'packages', 'zod');
			const testPath = join(packagePath, 'a');
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: testPath,
				depth: 1,
			});
			expect(result).toEqual([packagePath]);
		});

		it('should still find the inner package with depth 0 if cwd is the same folder', () => {
			const packagePath = join(mockProjectRoot, 'packages', 'zod');
			const foundPackageJsons = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: packagePath,
				depth: 0,
			});
			expect(foundPackageJsons).toEqual([packagePath]);
		});
	});

	describe('maxPackages', () => {
		it('should still find only the inner package is maxPackages is 1', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod', 'a', 'b');
			const packagePath = join(mockProjectRoot, 'packages', 'zod');
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: testPath,
				maxPackages: 1,
			});
			expect(result).toEqual([packagePath]);
		});

		it('should not find anything if maxPackages is 0 even if you stand directly on top of it', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod');
			const result = collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				cwd: testPath,
				maxPackages: 0,
			});
			expect(result).toEqual([]);
		});

		it('should find only one file if it cant leave the nearest package', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod', 'a', 'b');
			const packagePath = join(mockProjectRoot, 'packages', 'zod');
			const result = collectFileDirnamePathsUpDirectoryTree('rcfile', {
				cwd: testPath,
				maxPackages: 1,
			});
			expect(result).toEqual([packagePath]);
		});

		it('should not find the file in the workspace root if it isnt allowed to exit the current package', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod', 'a', 'b');
			const result = collectFileDirnamePathsUpDirectoryTree('readme.md', {
				cwd: testPath,
				maxPackages: 1,
			});
			expect(result).toEqual([]);
		});
	});

	describe('maxResults', () => {
		it('should find only one file if it is only allowed to find one result', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod', 'a', 'b');
			const packagePath = join(mockProjectRoot, 'packages', 'zod');
			const result = collectFileDirnamePathsUpDirectoryTree('rcfile', {
				cwd: testPath,
				maxResults: 1,
			});
			expect(result).toEqual([packagePath]);
		});

		it('should find only one in the root if it is only allowed to find one result', () => {
			const testPath = join(mockProjectRoot, 'packages', 'zod', 'a', 'b');
			const result = collectFileDirnamePathsUpDirectoryTree('readme.md', {
				cwd: testPath,
				maxResults: 1,
			});
			expect(result).toEqual([mockProjectRoot]);
		});
	});
});
