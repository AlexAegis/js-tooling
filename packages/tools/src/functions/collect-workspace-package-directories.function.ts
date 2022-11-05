import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { globby } from 'globby';
import { collectPackageJsonLocationsLinearly } from './collect-package-json-locations-linearly.function.js';
import { readPackageJson } from './read-package-json.function.js';

export interface RelativePackage {
	path: string;
	packageJson: PackageJson;
}

/**
 * Everything is sync to make it simpler using them in configuration files.
 */
export const collectWorkspacePackageDirectoriesWithPackageJson = async (
	path: string
): Promise<RelativePackage[]> => {
	const packages = collectPackageJsonLocationsLinearly(path);
	const rootWorkspace = packages[0];
	const packageJson = await readPackageJson(rootWorkspace);

	if (packageJson) {
		const rootPackage: RelativePackage = {
			path: rootWorkspace,
			packageJson,
		};
		if (packageJson.workspaces) {
			const paths = await globby(packageJson.workspaces, {
				gitignore: true,
				onlyDirectories: true,
				ignore: ['node_modules'],
				absolute: true,
				cwd: rootWorkspace,
			});

			const potentialSubPackages = await Promise.all(
				paths.map((path) =>
					readPackageJson(path).then((packageJson) => ({ packageJson, path }))
				)
			);

			const subPackages = potentialSubPackages.filter(
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

export const collectWorkspacePackageDirectories = async (path: string): Promise<string[]> => {
	const subPackages = await collectWorkspacePackageDirectoriesWithPackageJson(path);
	return subPackages.map((relativePackage) => relativePackage.path);
};
