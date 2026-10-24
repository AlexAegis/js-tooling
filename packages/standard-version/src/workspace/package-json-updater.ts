import type { PackageJson, WorkspacePackage } from '@alexaegis/workspace-tools';

import { PACKAGE_JSON_DEPENDENCY_FIELDS } from './collect-packages.js';

const workspaceDependencyVersionRegexp = /^(workspace:)([\^~*]?).*$/g;
const nonWorkspaceDependencyVersionRegexp = /^(?!workspace:)([\^~]?).*$/g;

/**
 * Updates the version of a package.json file, and the versions of the local
 * packages among its dependencies.
 */
export const createPackageJsonUpdater = (packages: WorkspacePackage[]) => {
	return {
		readVersion: (contents: string): string => {
			return /"version": "([^"]*)"/.exec(contents)?.[1] ?? '0.0.0';
		},
		writeVersion: (contents: string, version: string): string => {
			const packageJson: PackageJson = JSON.parse(contents) as PackageJson;
			const indent = '\t';
			const newline = contents.includes('\r\n') ? '\r\n' : '\n';
			packageJson.version = version;

			for (const localPackage of packages) {
				const localPackageName = localPackage.packageJson.name;
				if (!localPackageName) {
					continue;
				}

				for (const dependencyField of PACKAGE_JSON_DEPENDENCY_FIELDS) {
					const dependencies = packageJson[dependencyField];

					const localDependency: string | undefined = dependencies?.[localPackageName];

					if (dependencies && localDependency) {
						dependencies[localPackageName] = localDependency
							.replaceAll(workspaceDependencyVersionRegexp, '$1$2')
							.replaceAll(
								nonWorkspaceDependencyVersionRegexp,
								// a replacer function inserts the version without expanding $ patterns
								(_match, specifier: string) => `${specifier}${version}`,
							);
					}
				}
			}

			const json = JSON.stringify(packageJson, undefined, indent);

			return newline === '\r\n' ? json.replaceAll('\n', '\r\n') + '\r\n' : json + '\n';
		},
	};
};
