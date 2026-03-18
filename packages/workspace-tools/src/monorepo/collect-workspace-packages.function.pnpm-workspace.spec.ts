import type { Options } from 'globby';
import { join } from 'node:path/posix';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/fs.js';
import {
	PACKAGE_JSON_NAME,
	PNPM_WORKSPACE_FILE_NAME,
	type PackageJson,
	type PnpmWorkspaceYaml,
} from '../package-json/package-json.interface.js';
import { collectWorkspacePackages } from './collect-workspace-packages.function.js';
import type { WorkspacePackage } from './workspace-package.interface.js';

const mockPackageJsonValue: PackageJson = {
	name: 'name',
};

vi.mock('@alexaegis/fs', async () => {
	const mockReadJson = vi.fn<(_: string | undefined) => Promise<PackageJson | undefined>>(
		(path) =>
			Promise.resolve(path?.endsWith(PACKAGE_JSON_NAME) ? mockPackageJsonValue : undefined),
	);

	const mockReadYaml = vi.fn<(_: string | undefined) => Promise<PnpmWorkspaceYaml | undefined>>(
		(path) =>
			Promise.resolve(
				path?.endsWith(PNPM_WORKSPACE_FILE_NAME)
					? ({
							packages: ['packages/*'],
						} satisfies PnpmWorkspaceYaml)
					: undefined,
			),
	);

	return {
		readJson: mockReadJson,
		readYaml: mockReadYaml,
		normalizeCwdOption: await vi
			.importActual<typeof import('@alexaegis/fs')>('@alexaegis/fs')
			.then((mod) => mod.normalizeCwdOption),
		normalizeDirectoryDepthOption: await vi
			.importActual<typeof import('@alexaegis/fs')>('@alexaegis/fs')
			.then((mod) => mod.normalizeDirectoryDepthOption),
	};
});

vi.mock('node:fs', () => {
	return {
		existsSync: vi.fn(
			(path: string) =>
				path === join(mockProjectRoot, 'packages/zed', PACKAGE_JSON_NAME) ||
				path === join(mockProjectRoot, 'packages/zod', PACKAGE_JSON_NAME) ||
				path === join(mockProjectRoot, PACKAGE_JSON_NAME),
		),
	};
});

vi.mock('globby', () => {
	return {
		globby: (patterns: string[], options: Options): string[] => {
			expect(options.absolute).toBeTruthy();
			expect(options.onlyDirectories).toBeTruthy();
			expect(options.cwd).toBe('/foo/bar');

			return patterns.some((pattern) => pattern.startsWith('packages/*'))
				? ['/foo/bar/packages/zed', '/foo/bar/packages/zod']
				: [];
		},
	};
});

describe('collectWorkspacePackages in a multi-package pnpm workspace', () => {
	afterAll(() => {
		vi.resetAllMocks();
	});

	it('should be able to collect all packages in a workspace from a sub package', async () => {
		const foundPackageJsons = await collectWorkspacePackages({ cwd: '/foo/bar/packages/zed' });
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([
			{
				packageKind: 'root',
				packagePath: '/foo/bar',
				packageJson: mockPackageJsonValue,
				packageJsonPath: '/foo/bar/' + PACKAGE_JSON_NAME,
				workspacePackagePatterns: ['packages/*'],
				packagePathFromRootPackage: '.',
			},
			{
				packageKind: 'regular',
				packagePath: '/foo/bar/packages/zed',
				packageJsonPath: '/foo/bar/packages/zed/' + PACKAGE_JSON_NAME,
				packageJson: mockPackageJsonValue,
				packagePathFromRootPackage: 'packages/zed',
			},
			{
				packageKind: 'regular',
				packagePath: '/foo/bar/packages/zod',
				packageJsonPath: '/foo/bar/packages/zod/' + PACKAGE_JSON_NAME,
				packageJson: mockPackageJsonValue,
				packagePathFromRootPackage: 'packages/zod',
			},
		]);
	});

	it('should be able to collect all packages in a workspace from the root', async () => {
		const foundPackageJsons = await collectWorkspacePackages({ cwd: '/foo/bar' });
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([
			{
				packageKind: 'root',
				packageJson: mockPackageJsonValue,
				packagePath: '/foo/bar',
				packageJsonPath: '/foo/bar/' + PACKAGE_JSON_NAME,
				workspacePackagePatterns: ['packages/*'],
				packagePathFromRootPackage: '.',
			},
			{
				packageKind: 'regular',
				packageJson: mockPackageJsonValue,
				packagePath: '/foo/bar/packages/zed',
				packageJsonPath: '/foo/bar/packages/zed/' + PACKAGE_JSON_NAME,
				packagePathFromRootPackage: 'packages/zed',
			},
			{
				packageKind: 'regular',
				packageJson: mockPackageJsonValue,
				packagePath: '/foo/bar/packages/zod',
				packageJsonPath: '/foo/bar/packages/zod/' + PACKAGE_JSON_NAME,
				packagePathFromRootPackage: 'packages/zod',
			},
		]);
	});

	it('should be able to collect nothing, outside the workspace', async () => {
		const foundPackageJsons = await collectWorkspacePackages({ cwd: '/foo' });
		expect(foundPackageJsons).toEqual([]);
	});

	it('should be able to collect only iner packages if skipWorkspaceRoot is enabled', async () => {
		const foundPackageJsons = await collectWorkspacePackages({
			cwd: '/foo/bar',
			skipWorkspaceRoot: true,
		});
		expect(foundPackageJsons).toEqual([
			{
				packageKind: 'regular',
				packageJson: mockPackageJsonValue,
				packagePath: '/foo/bar/packages/zed',
				packageJsonPath: '/foo/bar/packages/zed/' + PACKAGE_JSON_NAME,
				packagePathFromRootPackage: 'packages/zed',
			},
			{
				packageKind: 'regular',
				packageJson: mockPackageJsonValue,
				packagePath: '/foo/bar/packages/zod',
				packageJsonPath: '/foo/bar/packages/zod/' + PACKAGE_JSON_NAME,
				packagePathFromRootPackage: 'packages/zod',
			},
		]);
	});
});
