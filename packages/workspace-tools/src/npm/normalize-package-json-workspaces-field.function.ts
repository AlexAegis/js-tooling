import type { PackageJson } from '../package-json/package-json.interface.js';

export const normalizePackageJsonWorkspacesField = (
	packageJsonWorkspaces?: PackageJson['workspaces'],
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
