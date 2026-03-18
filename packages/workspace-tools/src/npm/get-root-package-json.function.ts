import { readJson, readYaml } from '@alexaegis/fs';
import { join } from 'node:path';
import type { RootWorkspacePackage } from '../monorepo/workspace-package.interface.js';
import {
	PACKAGE_JSON_NAME,
	PNPM_WORKSPACE_FILE_NAME,
	type PackageJson,
	type PnpmWorkspaceYaml,
} from '../package-json/package-json.interface.js';
import {
	normalizeGetRootPackageJsonOptions,
	type GetRootPackageJsonOptions,
} from './get-root-package-json.function.options.js';
import { getWorkspaceRoot } from './get-workspace-root.function.js';
import { normalizePackageJsonWorkspacesField } from './normalize-package-json-workspaces-field.function.js';

export const getRootPackageJson = async (
	rawOptions: GetRootPackageJsonOptions,
): Promise<RootWorkspacePackage | undefined> => {
	const options = normalizeGetRootPackageJsonOptions(rawOptions);
	const rootWorkspace = getWorkspaceRoot(options);
	if (!rootWorkspace) {
		options.logger.error('No package json was found! Cannot collect workspace packages!');

		return undefined;
	}

	const packageJsonPath = join(rootWorkspace, PACKAGE_JSON_NAME);
	const packageJson = await readJson<PackageJson>(packageJsonPath).catch(() => undefined);

	if (!packageJson) {
		options.logger.error('Failed to read packageJson!', packageJsonPath);
		return undefined;
	}

	let workspaces = normalizePackageJsonWorkspacesField(packageJson.workspaces);

	const pnpmWorkspace = await readYaml<PnpmWorkspaceYaml>(
		join(rootWorkspace, PNPM_WORKSPACE_FILE_NAME),
	);

	if (pnpmWorkspace?.packages) {
		workspaces = [...workspaces, ...pnpmWorkspace.packages];
	}

	return {
		packageJson,
		packageKind: 'root',
		workspacePackagePatterns: workspaces,
		packageJsonPath: packageJsonPath,
		packagePath: rootWorkspace,
		packagePathFromRootPackage: '.',
	};
};
