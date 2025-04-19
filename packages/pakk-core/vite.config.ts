import { mergeConfig } from 'vite';

// Intentionally imported across packages, this isn't source code so it's fine.
// It is to avoid cyclic dependencies.
import { pakk } from '../pakk-vite-plugin/src/index.js';

import {
	collectFileDirnamePathsUpDirectoryTree,
	PACKAGE_JSON_NAME,
	type PackageJson,
} from '@alexaegis/workspace-tools';
import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import p from 'node:path';
import { type LibraryFormats, type UserConfig } from 'vite';

export const DEFAULT_OUT_DIR = 'dist';
export const DEFAULT_ENTRY = ['src/index.ts'];
export const DEFAULT_EXPORT_FORMATS: LibraryFormats[] = ['es', 'cjs'];
export const DEFAULT_BUILD_TARGET = 'es2022';

export const DEFAULT_VITE_CONFIG: UserConfig = {
	build: {
		target: DEFAULT_BUILD_TARGET,
		outDir: DEFAULT_OUT_DIR,
	},
};

export const createRollupExternalsFn = (...packageJsons: PackageJson[]) => {
	const dependencyNames: string[] = [];

	for (const packageJson of packageJsons) {
		if (packageJson.name) {
			dependencyNames.push(packageJson.name);
		}

		if (packageJson.dependencies) {
			dependencyNames.push(...Object.keys(packageJson.dependencies));
		}
		// https://github.com/Septh/rollup-plugin-node-externals does not externalizes devDependencies
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
		externalsFn ??= createRollupExternalsFn(
			...collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, {
				maxPackages: 2,
			}).map(
				(path) =>
					JSON.parse(
						readFileSync(p.join(path, PACKAGE_JSON_NAME), { encoding: 'utf8' }),
					) as PackageJson,
			),
		);

		return externalsFn(source, importer, isResolved);
	};
};

const DEFAULT_VITE_LIB_CONFIG = mergeConfig(DEFAULT_VITE_CONFIG, {
	build: {
		minify: false,
		sourcemap: true,
		rollupOptions: {
			external: createLazyAutoExternalsFunction(), // I'm always using this, but autolib also adds it with the other defaults if they are not defined
			treeshake: true,
		},
		lib: {
			entry: DEFAULT_ENTRY,
			formats: DEFAULT_EXPORT_FORMATS,
		},
	},
	resolve: {
		alias: {
			'unicorn-magic': 'src/unicorn-magic.js',
		},
	},
} satisfies UserConfig);

export default mergeConfig(DEFAULT_VITE_LIB_CONFIG, {
	plugins: [pakk()],
});
