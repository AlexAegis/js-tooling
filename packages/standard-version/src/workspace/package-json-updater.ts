import type { PackageJson, WorkspacePackage } from '@alexaegis/workspace-tools';

import { PACKAGE_JSON_DEPENDENCY_FIELDS } from './collect-packages.js';

const workspaceDependencyVersionRegexp = /^(workspace:)([\^~])?.*$/g;
const nonWorkspaceDependencyVersionRegexp = /^(?!workspace:)([\^~])?.*$/g;

/**
 * This updater also updates all local dependencies too that were updated
 * While it's mainly used for packageJson files, it does not assume the file to
 * be valid JSON, so it can be used with any file that contains lines like
 * "version": "0.0.0", like examples in readme files.
 *
 * It also replaces everything that looks like a `packageName@version`
 */
export const createPackageJsonUpdater = (packages: WorkspacePackage[]) => {
	return {
		readVersion: (contents: string): string => {
			const results = [...contents.matchAll(/"version": "(.*)"/g)];
			return results[0]?.[1] ?? '0.0.0';
		},
		writeVersion: (contents: string, version: string): string => {
			const packageJson: PackageJson = JSON.parse(contents) as PackageJson;
			const indent = '\t';
			const newline = contents.includes('\r\n') ? '\r\n' : '\n';
			packageJson.version = version;

			for (const localPackageName of packages
				.map((localPackage) => localPackage.packageJson.name)
				.filter((name): name is string => !!name)) {
				for (const dependencyField of PACKAGE_JSON_DEPENDENCY_FIELDS) {
					const dependencies = packageJson[dependencyField];

					const localDependency: string | undefined = dependencies?.[localPackageName];

					if (dependencies && localDependency) {
						dependencies[localPackageName] = localDependency
							.replaceAll(workspaceDependencyVersionRegexp, '$1$2')
							.replaceAll(nonWorkspaceDependencyVersionRegexp, `$1${version}`);
					}
				}
			}

			const json = JSON.stringify(packageJson, undefined, indent);

			if (newline === '\r\n') {
				return json.replaceAll('\n', '\r\n') + '\r\n';
			}

			return json + '\n';
		},
	};
};
