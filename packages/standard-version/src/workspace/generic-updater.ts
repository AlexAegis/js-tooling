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
			return /"version": "([^"]*)"/.exec(contents)?.[1] ?? '0.0.0';
		},
		writeVersion: (contents: string, version: string): string => {
			// replacer functions insert the version without expanding $ patterns
			return packages
				.map((localPackage) => localPackage.packageJson.name)
				.filter((name): name is string => !!name)
				.reduce(
					(r, localPackageName) => {
						const name = RegExp.escape(localPackageName);
						return r
							.replaceAll(
								new RegExp(`"${name}": "(workspace:)([~^*]?)[^"]*"`, 'g'),
								(_match, protocol: string, specifier: string) =>
									`"${localPackageName}": "${protocol}${specifier}"`, // keeps workspace:*, workspace:^ and workspace:~ without a version, as pnpm add saves them by default
							)
							.replaceAll(
								new RegExp(`"${name}": "(?!workspace:)([~^]?)[^"]*"`, 'g'),
								(_match, specifier: string) =>
									`"${localPackageName}": "${specifier}${version}"`,
							)
							.replaceAll(
								new RegExp(
									// not part of a longer name, like foob or @x/b for the package b
									String.raw`(?<![A-Za-z0-9.-]|[\w.-]_|@[\w.-]*/)${name}@([~^]?)\d+\.\d+\.\d+(?:-[\w.-]*\w)?(?:\+[\w.-]*\w)?`,
									'g',
								),
								(_match, specifier: string) =>
									`${localPackageName}@${specifier}${version}`,
							);
					},
					contents.replace(/"version": "[^"]*"/, () => `"version": "${version}"`),
				);
		},
	};
};
