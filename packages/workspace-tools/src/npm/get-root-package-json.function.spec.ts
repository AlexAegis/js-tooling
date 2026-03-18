import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { mockProjectRoot } from '../../__mocks__/fs.js';
import type { RootWorkspacePackage } from '../index.js';
import {
	PACKAGE_JSON_NAME,
	PNPM_WORKSPACE_FILE_NAME,
	type PackageJson,
	type PnpmWorkspaceYaml,
} from '../package-json/package-json.interface.js';
import { getRootPackageJson } from './get-root-package-json.function.js';

const packageJsonWorkspaces: string[] = ['libs/*'];
const pnpmWorkspaceYamlWorkspaces: string[] = ['packages/*'];
const mockPackageJsonValue: PackageJson = {
	name: 'name',
	workspaces: packageJsonWorkspaces,
};

vi.mock('fs');

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
							packages: pnpmWorkspaceYamlWorkspaces,
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

describe('getRootPackageJson', () => {
	it('should find both normal packageJson and pnpm data', async () => {
		const rootPackage = await getRootPackageJson({
			cwd: mockProjectRoot,
		});

		expect(rootPackage).toEqual<RootWorkspacePackage>({
			packageJson: mockPackageJsonValue,
			packageKind: 'root',
			packagePathFromRootPackage: '.',
			packageJsonPath: join(mockProjectRoot, PACKAGE_JSON_NAME),
			packagePath: mockProjectRoot,
			workspacePackagePatterns: [...packageJsonWorkspaces, ...pnpmWorkspaceYamlWorkspaces],
		});
	});

	it('should not find one outside of a workspace', async () => {
		const rootPackage = await getRootPackageJson({ cwd: '/' });
		expect(rootPackage).toBeUndefined();
	});
});
