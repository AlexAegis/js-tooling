import type { PackageJson } from '../package-json/package-json.interface.js';

interface BaseWorkspacePackage {
	packageJson: PackageJson;
	packageJsonPath: string;
	packagePath: string;
}

export interface RootWorkspacePackage extends BaseWorkspacePackage {
	packageKind: 'root';
	/**
	 * the workspaces field joined together with the pnpm workspace files
	 * values.
	 *
	 * ? This whole layer can be removed when pnpm stops supporting it's own
	 * ? workspaces property and rely entirely on what's in the packageJson
	 */
	workspacePackagePatterns: string[];
	packagePathFromRootPackage: '.';
}

export interface RegularWorkspacePackage extends BaseWorkspacePackage {
	packageKind: 'regular';
	packagePathFromRootPackage: string;
}
export type WorkspacePackage = RootWorkspacePackage | RegularWorkspacePackage;
