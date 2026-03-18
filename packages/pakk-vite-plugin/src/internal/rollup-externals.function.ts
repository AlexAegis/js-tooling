import {
	PACKAGE_JSON_NAME,
	collectFileDirnamePathsUpDirectoryTree,
	type PackageJson,
} from '@alexaegis/workspace-tools';
import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import p from 'node:path';

export const createRollupExternalsFn = (...packageJsons: PackageJson[]) => {
	const dependencyNames: string[] = [];

	for (const packageJson of packageJsons) {
		if (packageJson.name) {
			dependencyNames.push(packageJson.name);
		}

		if (packageJson.dependencies) {
			dependencyNames.push(...Object.keys(packageJson.dependencies));
		}
		// https://github.com/Septh/rollup-plugin-node-externals does not externalises devDependencies
		// by default. devDependencies are usually not included in source code anyways
		if (packageJson.devDependencies) {
			dependencyNames.push(...Object.keys(packageJson.devDependencies));
		}
		if (packageJson.peerDependencies) {
			dependencyNames.push(...Object.keys(packageJson.peerDependencies));
		}
		if (packageJson.optionalDependencies) {
			dependencyNames.push(...Object.keys(packageJson.optionalDependencies));
		}
	}

	return (source: string, _importer: string | undefined, _isResolved: boolean): boolean => {
		return (
			dependencyNames.some((dep) => source === dep || source.startsWith(dep + '/')) ||
			builtinModules.includes(source) ||
			source.startsWith('node:')
		);
	};
};

export const createLazyAutoExternalsFunction = () => {
	let externalsFn:
		| ((source: string, importer: string | undefined, isResolved: boolean) => boolean)
		| undefined;

	return (source: string, importer: string | undefined, isResolved: boolean): boolean => {
		if (!externalsFn) {
			externalsFn = createRollupExternalsFn(
				...collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
					maxPackages: 2,
				}).map(
					(path) =>
						JSON.parse(
							readFileSync(p.join(path, PACKAGE_JSON_NAME), { encoding: 'utf8' }),
						) as PackageJson,
				),
			);
		}

		return externalsFn(source, importer, isResolved);
	};
};
