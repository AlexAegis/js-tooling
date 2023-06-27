import { isNotNullish } from '@alexaegis/common';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';

/**
 * This updater also updates all local dependencies too that were updated
 * While it's mainly used for packageJson files, it does not assume the file to
 * be valid JSON, so it can be used with any file that contains lines like
 * "version": "0.0.0", like examples in readme files.
 *
 * It also replaces everything that looks like a `packageName@version`
 */
export const createGenericUpdater = (packages: WorkspacePackage[]) => {
	return {
		readVersion: (contents: string): string => {
			const results = [...contents.matchAll(/"version": "(.*)"/g)];
			return results[0]?.[1] ?? '0.0.0';
		},
		writeVersion: (contents: string, version: string): string => {
			return packages
				.map((localPackage) => localPackage.packageJson.name)
				.filter(isNotNullish)
				.reduce(
					(r, localPackageName) =>
						r
							.replaceAll(
								new RegExp(`"${localPackageName}": "(workspace:)([~^])?.*"`, 'g'),
								`"${localPackageName}": "$1$2"` // the workspace protocol does not include versions but keeps the specifier. This is how pnpm leaves them on install.
							)
							.replaceAll(
								new RegExp(`"${localPackageName}": "(?!workspace:)([~^])?.*"`, 'g'),
								`"${localPackageName}": "$1${version}"`
							)
							.replaceAll(
								new RegExp(`${localPackageName}@([^s\t\n\r]+)`, 'g'),
								`${localPackageName}@${version}`
							),
					contents.replace(/"version": ".*"/, `"version": "${version}"`)
				);
		},
	};
};
