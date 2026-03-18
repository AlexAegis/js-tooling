import type { Options } from 'globby';

import { join } from 'node:path/posix';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/fs.js';

import { PACKAGE_JSON_NAME, type PackageJson } from '../package-json/package-json.interface.js';
import { collectWorkspacePackages } from './collect-workspace-packages.function.js';
import type { WorkspacePackage } from './workspace-package.interface.js';

const mockPackageJsonWorkspaceValue: PackageJson = {
	name: 'name',
	workspaces: ['packages/**'],
};

const mockPackageJsonZedValue: PackageJson = {
	name: 'name',
	dependencies: { foo: '1.0.0', bar: '1.0.0' },
	keywords: ['keyA'],
};

const mockPackageJsonZodValue: PackageJson = {
	name: 'name',
	dependencies: { foo: '1.0.0' },
	keywords: ['keyA', 'keyB'],
};

vi.mock('@alexaegis/fs', async () => {
	const mockReadJson = vi.fn<(_: string | undefined) => Promise<PackageJson | undefined>>(
		(path) =>
			new Promise((resolve) => {
				if (path?.endsWith(join('zed', PACKAGE_JSON_NAME))) {
					resolve(mockPackageJsonZedValue);
				} else if (path?.endsWith(join('zod', PACKAGE_JSON_NAME))) {
					resolve(mockPackageJsonZodValue);
				} else if (path?.endsWith(join('empty', PACKAGE_JSON_NAME))) {
					throw new Error('does not exist');
				} else if (path?.endsWith(PACKAGE_JSON_NAME)) {
					resolve(mockPackageJsonWorkspaceValue);
				} else {
					resolve(undefined);
				}
			}),
	);

	const mockReadYaml = vi.fn<(_: string | undefined) => undefined>((_path) => {
		return undefined;
	});

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
		existsSync: vi.fn((path: string) => {
			return (
				path === join(mockProjectRoot, 'packages/zed', PACKAGE_JSON_NAME) ||
				path === join(mockProjectRoot, 'packages/zod', PACKAGE_JSON_NAME) ||
				path === join(mockProjectRoot, PACKAGE_JSON_NAME)
			);
		}),
	};
});

vi.mock('globby', () => {
	return {
		globby: (_patterns: string[], options: Options): string[] => {
			expect(options.absolute).toBeTruthy();
			expect(options.onlyDirectories).toBeTruthy();
			expect(options.cwd).toBe('/foo/bar');
			return ['/foo/bar/packages/zed', '/foo/bar/packages/zod', '/foo/bar/packages/empty'];
		},
	};
});

describe('collectWorkspacePackages in a multi-package npm workspace', () => {
	const workspacePackageRoot: WorkspacePackage = {
		packageKind: 'root',
		packageJson: mockPackageJsonWorkspaceValue,
		packagePath: '/foo/bar',
		packageJsonPath: '/foo/bar/' + PACKAGE_JSON_NAME,
		workspacePackagePatterns: ['packages/**'],
		packagePathFromRootPackage: '.',
	};

	const workspacePackageZed: WorkspacePackage = {
		packageKind: 'regular',
		packageJson: mockPackageJsonZedValue,
		packagePath: '/foo/bar/packages/zed',
		packageJsonPath: '/foo/bar/packages/zed/' + PACKAGE_JSON_NAME,
		packagePathFromRootPackage: 'packages/zed',
	};

	const workspacePackageZod: WorkspacePackage = {
		packageKind: 'regular',
		packageJson: mockPackageJsonZodValue,
		packagePath: '/foo/bar/packages/zod',
		packageJsonPath: '/foo/bar/packages/zod/' + PACKAGE_JSON_NAME,
		packagePathFromRootPackage: 'packages/zod',
	};

	afterAll(() => {
		vi.resetAllMocks();
	});

	it('should be able to collect all packages in a workspace from a sub package', async () => {
		const foundPackageJsons = await collectWorkspacePackages({ cwd: '/foo/bar/packages/zed' });
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([
			workspacePackageRoot,
			workspacePackageZed,
			workspacePackageZod,
		]);
	});

	it('should be able to collect all packages in a workspace from the root', async () => {
		const foundPackageJsons = await collectWorkspacePackages({ cwd: '/foo/bar' });
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([
			workspacePackageRoot,
			workspacePackageZed,
			workspacePackageZod,
		]);
	});

	it('should be able to collect packages with specific dependencies being present', async () => {
		const foundPackageJsons = await collectWorkspacePackages({
			cwd: '/foo/bar',
			dependencyCriteria: ['foo', 'bar'],
		});
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([workspacePackageZed]);
	});

	it('should be able to collect packages with specific keywords being present', async () => {
		const foundPackageJsons = await collectWorkspacePackages({
			cwd: '/foo/bar',
			packageJsonMatcher: {
				keywords: (keywords) => keywords?.includes('keyB') && keywords.includes('keyA'),
			},
		});
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([workspacePackageZod]);
	});

	it('should be able to collect packages with both a keywords and dependency criteria being present', async () => {
		const foundPackageJsons = await collectWorkspacePackages({
			cwd: '/foo/bar',
			dependencyCriteria: ['foo'],
			packageJsonMatcher: {
				keywords: (keywords) => keywords?.includes('keyB'),
			},
		});
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([workspacePackageZod]);
	});

	it('should be able to collect nothing, outside the workspace', async () => {
		const foundPackageJsons = await collectWorkspacePackages({ cwd: '/foo' });
		expect(foundPackageJsons).toEqual<WorkspacePackage[]>([]);
	});
});
