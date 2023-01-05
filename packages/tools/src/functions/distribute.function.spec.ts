import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import type { Options } from 'globby';
import type { PathLike } from 'node:fs';
import { join, sep } from 'node:path';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { distribute } from './distribute.function.js';

const cpMock = vi.fn();
const symlinkMock = vi.fn();

describe('distribute', () => {
	beforeAll(async () => {
		vi.mock('globby', () => {
			return {
				globby: async (_patterns: string[], options: Options): Promise<string[]> => {
					expect(options.absolute).toBeTruthy();
					expect(options.onlyDirectories).toBeTruthy();
					expect(options.cwd).toBe('/foo/bar');
					return ['/foo/bar/packages/zed', '/foo/bar/packages/zod'];
				},
			};
		});
		vi.mock('node:fs', async () => {
			return {
				lstatSync: vi.fn((path: string) => {
					switch (path) {
						case 'rcfile':
						case '/foo/bar/packages/rcfile':
						case '/foo/bar/packages/zed/rcfile': {
							return { isFile: () => true, isSymbolicLink: () => false };
						}
						case '/foo/bar/packages/zod/rcfile': {
							return { isFile: () => true, isSymbolicLink: () => true };
						}
						case '/foo/bar/packages/nonfile': {
							return { isFile: () => false, isSymbolicLink: () => true };
						}
						default: {
							return undefined;
						}
					}
				}),
				existsSync: vi.fn(
					(path: PathLike) =>
						path === '/foo/bar/packages/zed/package.json' ||
						path === '/foo/bar/packages/zed/rcfile' ||
						path === '/foo/bar/packages/zod/package.json' ||
						path === '/foo/bar/packages/zod/rcfile' ||
						path === '/foo/bar/packages/readme.md' ||
						path === '/foo/bar/packages/rcfile' ||
						path === '/foo/bar/packages/nonfile' ||
						path === '/foo/bar/package.json'
				),
			};
		});

		vi.mock('node:fs/promises', async () => {
			return {
				lstat: vi.fn(async (path: string) => {
					switch (path) {
						case 'rcfile':
						case '/foo/bar/packages/rcfile':
						case '/foo/bar/packages/zed/rcfile': {
							return { isFile: () => true, isSymbolicLink: () => false };
						}
						case '/foo/bar/packages/zod/rcfile': {
							return { isFile: () => true, isSymbolicLink: () => true };
						}
						case '/foo/bar/packages/nonfile': {
							return { isFile: () => false, isSymbolicLink: () => true };
						}
						default: {
							return undefined;
						}
					}
				}),
				cp: vi.fn(async (path: string, target: string) => cpMock(path, target)),
				symlink: vi.fn(async (path: string, target: string) => symlinkMock(path, target)),
				readFile: vi.fn(
					async (path: PathLike): Promise<string | undefined> =>
						path === '/foo/bar/package.json'
							? JSON.stringify({
									workspaces: ['apps/*', 'libs/*', 'packages/*'],
							  } as PackageJson)
							: path === '/foo/bar/packages/zed/package.json' ||
							  path === '/foo/bar/packages/zod/package.json'
							? JSON.stringify({} as PackageJson)
							: undefined
				),
			};
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('symlinking', () => {
		it('should symlink to all folders', async () => {
			const filename = 'rcfile';
			await distribute(filename, { cwd: '/foo/bar/packages', symlinkInsteadOfCopy: true });

			expect(symlinkMock).toHaveBeenCalledWith(
				`packages${sep}${filename}`,
				join('/foo/bar', filename)
			);
			expect(symlinkMock).toHaveBeenCalledTimes(1);
		});

		it('should refuse to link something thats nonexistent', async () => {
			const filename = 'nonexistent';
			await distribute(filename, { cwd: '/foo/bar/packages', symlinkInsteadOfCopy: true });

			expect(symlinkMock).toHaveBeenCalledTimes(0);
		});

		it('should refuse to link something thats not a file', async () => {
			const filename = 'nonfile';
			await distribute(filename, {
				dependencyCriteria: ['@dep'],
				cwd: '/foo/bar/packages',
				symlinkInsteadOfCopy: true,
			});

			expect(symlinkMock).toHaveBeenCalledTimes(0);
		});
	});
});
