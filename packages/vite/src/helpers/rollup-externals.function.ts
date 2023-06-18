import {
	PACKAGE_JSON_NAME,
	collectPackageJsonPathsUpDirectoryTree,
} from '@alexaegis/workspace-tools';
import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { join } from 'node:path';

interface PackageJson {
	dependencies?: Record<string, unknown>;
	devDependencies?: Record<string, unknown>;
	peerDependencies?: Record<string, unknown>;
	optionalDependencies?: Record<string, unknown>;
}

export const createRollupExternalsFn = (...packageJsons: PackageJson[]) => {
	const dependencyNames: string[] = [];

	for (const packageJson of packageJsons) {
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
			dependencyNames.includes(source) ||
			builtinModules.includes(source) ||
			source.startsWith('node:')
		);
	};
};

/**
 * TODO: this will be defined in autolib, replace this once thats published
 * @deprecated this will be defined in autolib, replace this once thats published
 */
export const createLazyAutoExternalsFunction = () => {
	let externalsFn:
		| ((source: string, importer: string | undefined, isResolved: boolean) => boolean)
		| undefined;

	return (source: string, importer: string | undefined, isResolved: boolean): boolean => {
		if (!externalsFn) {
			externalsFn = createRollupExternalsFn(
				...collectPackageJsonPathsUpDirectoryTree().map(
					(path) =>
						JSON.parse(
							readFileSync(join(path, PACKAGE_JSON_NAME), { encoding: 'utf8' })
						) as PackageJson
				)
			);
		}

		return externalsFn(source, importer, isResolved);
	};
};
