import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import type { Options } from 'globby';
import type { PathLike } from 'node:fs';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { collectWorkspacePackageDirectories } from './collect-workspace-package-directories.function';

describe('collectWorkspacePackageDirectories with a workspace', () => {
	beforeAll(() => {
		vi.mock('globby', () => {
			return {
				globby: (_patterns: string[], options: Options): string[] => {
					expect(options.absolute).toBeTruthy();
					expect(options.onlyDirectories).toBeTruthy();
					expect(options.cwd).toBe('/foo/bar');
					return ['/foo/bar/packages/zed', '/foo/bar/packages/zod'];
				},
			};
		});
		vi.mock('node:fs', async () => {
			return {
				existsSync: vi.fn(
					(path: PathLike) =>
						path === '/foo/bar/packages/zed/package.json' ||
						path === '/foo/bar/packages/zod/package.json' ||
						path === '/foo/bar/packages/readme.md' ||
						path === '/foo/bar/package.json'
				),
			};
		});
		vi.mock('node:fs/promises', async () => {
			return {
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

	it('should be able to collect all packages in a workspace from a sub package', async () => {
		const foundPackageJsons = await collectWorkspacePackageDirectories('/foo/bar/packages/zed');
		expect(foundPackageJsons).toEqual([
			'/foo/bar',
			'/foo/bar/packages/zed',
			'/foo/bar/packages/zod',
		]);
	});

	it('should be able to collect all packages in a workspace from the root', async () => {
		const foundPackageJsons = await collectWorkspacePackageDirectories('/foo/bar');
		expect(foundPackageJsons).toEqual([
			'/foo/bar',
			'/foo/bar/packages/zed',
			'/foo/bar/packages/zod',
		]);
	});

	it('should be able to collect nothing, outside the workspace', async () => {
		const foundPackageJsons = await collectWorkspacePackageDirectories('/foo');
		expect(foundPackageJsons).toEqual([]);
	});
});
