import type { PackageJson, PnpmWorkspaceYaml, WorkspacePackage } from '@alexaegis/workspace-tools';
import { globSync } from 'glob';
import { load } from 'js-yaml';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';

/**
 * The functions found in this file are copied from @alexaegis/workspace-tools
 * to be a sync, non-esm (globby is only esm) variant that could be invoked
 * from a CJS based configuration file.
 */
export const collectPackages = (): {
	workspacePackage: WorkspacePackage;
	subPackages: WorkspacePackage[];
} => {
	const workspaceRoot = getWorkspaceRoot();

	if (!workspaceRoot) {
		throw new Error('not in a workspace');
	}

	const pnpmWorkspace = load(
		readFileSync(join(workspaceRoot, 'pnpm-workspace.yaml'), { encoding: 'utf8' })
	) as PnpmWorkspaceYaml;

	const workspacePackageJson = JSON.parse(
		readFileSync(join(workspaceRoot, 'package.json'), { encoding: 'utf8' })
	) as PackageJson;

	let workspaces = normalizePackageJsonWorkspacesField(workspacePackageJson.workspaces);

	if (pnpmWorkspace.packages) {
		workspaces = [...workspaces, ...pnpmWorkspace.packages];
	}

	const packagePaths = globSync(workspaces, {
		ignore: ['node_modules'],
		cwd: workspaceRoot,
		absolute: true,
	}).filter((path) => statSync(path).isDirectory());

	const workspacePackage: WorkspacePackage = {
		path: workspaceRoot,
		packageJson: workspacePackageJson,
	};
	const subPackages: WorkspacePackage[] = packagePaths.map((packagePath) => ({
		path: packagePath.toString(),
		packageJson: JSON.parse(
			readFileSync(join(packagePath, 'package.json'), { encoding: 'utf8' })
		) as PackageJson,
	}));

	return { workspacePackage, subPackages };
};

const getWorkspaceRoot = (cwd: string = process.cwd()): string | undefined => {
	return collectPackageJsonPathsUpDirectoryTree(cwd)[0];
};

const collectPackageJsonPathsUpDirectoryTree = (cwd: string = process.cwd()): string[] => {
	return collectPackageJsonPathsUpDirectoryTreeInternal(cwd);
};

const collectPackageJsonPathsUpDirectoryTreeInternal = (
	cwd: string,
	collection: string[] = []
): string[] => {
	const path = normalize(cwd);

	if (existsSync(join(path, 'package.json'))) {
		collection.unshift(path);
	}

	const parentPath = join(path, '..');
	if (parentPath !== path) {
		return collectPackageJsonPathsUpDirectoryTreeInternal(parentPath, collection);
	}

	return collection;
};

const normalizePackageJsonWorkspacesField = (
	packageJsonWorkspaces?: PackageJson['workspaces']
): string[] => {
	if (Array.isArray(packageJsonWorkspaces)) {
		return packageJsonWorkspaces;
	} else if (packageJsonWorkspaces) {
		return [
			...(packageJsonWorkspaces.packages ?? []),
			...(packageJsonWorkspaces.nohoist ?? []),
		];
	} else {
		return [];
	}
};
