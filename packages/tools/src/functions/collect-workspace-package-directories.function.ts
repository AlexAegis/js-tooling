import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { globbySync } from 'globby';
import { collectPackageJsonLocationsLinearly } from './collect-package-json-locations-linearly.function.js';
import { readPackageJsonSync } from './read-package-json-sync.function.js';

export interface RelativePackage {
	path: string;
	packageJson: PackageJson;
}

/**
 * Everything is sync to make it simpler using them in configuration files.
 */
export const collectWorkspacePackageDirectoriesWithPackageJson = (
	path: string
): RelativePackage[] => {
	const packages = collectPackageJsonLocationsLinearly(path);
	const rootWorkspace = packages[0];
	const packageJson = readPackageJsonSync(rootWorkspace);

	if (packageJson) {
		const rootPackage: RelativePackage = {
			path: rootWorkspace,
			packageJson,
		};
		if (packageJson.workspaces) {
			const paths = globbySync(packageJson.workspaces, {
				gitignore: true,
				onlyDirectories: true,
				ignore: ['node_modules'],
				absolute: true,
				cwd: rootWorkspace,
			});
			const subPackages = paths
				.map((path) => ({ packageJson: readPackageJsonSync(path), path }))
				.filter(
					(relativePackage): relativePackage is RelativePackage =>
						!!relativePackage.packageJson
				);

			return [rootPackage, ...subPackages];
		} else {
			return [rootPackage];
		}
	} else {
		return [];
	}
};

export const collectWorkspacePackageDirectories = (path: string): string[] => {
	return collectWorkspacePackageDirectoriesWithPackageJson(path).map(
		(relativePackage) => relativePackage.path
	);
};
