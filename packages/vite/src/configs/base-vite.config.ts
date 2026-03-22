import { existsSync, readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import p, { join, normalize } from 'node:path';
import type { LibraryFormats } from 'vite';
import { mergeConfig, type UserConfig } from 'vite';
import { toBaseHref } from '../helpers/to-base-href.function.js';

const PACKAGE_JSON_NAME = 'package.json';

interface MinimalPackageJson {
	name?: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
	exports?: Record<string, string | Record<string, string>>;
	bin?: string | Record<string, string>;
	publishConfig?: {
		bin?: string | Record<string, string>;
		exports?: Record<string, string | Record<string, string>>;
	};
}

const collectPackageJsonPaths = (options?: { cwd?: string; maxPackages?: number }): string[] => {
	const cwd = options?.cwd ?? process.cwd();
	const maxPackages = options?.maxPackages ?? 2;
	const results: string[] = [];
	const packages: string[] = [];
	let current = normalize(cwd);

	while (packages.length < maxPackages) {
		if (existsSync(join(current, PACKAGE_JSON_NAME))) {
			results.unshift(current);
			packages.unshift(current);
		}
		const parent = join(current, '..');
		if (parent === current) break;
		current = parent;
	}

	return results;
};

const createRollupExternalsFn = (...packageJsons: MinimalPackageJson[]) => {
	const dependencyNames: string[] = [];

	for (const packageJson of packageJsons) {
		if (packageJson.name) {
			dependencyNames.push(packageJson.name);
		}
		if (packageJson.dependencies) {
			dependencyNames.push(...Object.keys(packageJson.dependencies));
		}
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
			...collectPackageJsonPaths({ maxPackages: 2 }).map(
				(path) =>
					JSON.parse(
						readFileSync(p.join(path, PACKAGE_JSON_NAME), { encoding: 'utf8' }),
					) as MinimalPackageJson,
			),
		);

		return externalsFn(source, importer, isResolved);
	};
};

/**
 * Derives vite `build.lib.entry` from the `exports` and `bin` fields of the
 * nearest `package.json`. Code exports are identified by their `types` condition
 * pointing at a source file (e.g. `"./src/index.ts"`), and bin entries are read
 * from `publishConfig.bin` (which points at `"./dist/bin/…"` and is mapped back
 * to the corresponding source file).
 *
 * Falls back to `DEFAULT_ENTRY` when no code entries can be derived.
 */
export const getLibEntryFromExports = (options?: { cwd?: string }): Record<string, string> => {
	const cwd = options?.cwd ?? process.cwd();
	const pkgPath = p.join(cwd, PACKAGE_JSON_NAME);

	if (!existsSync(pkgPath)) {
		return { index: 'src/index.ts' };
	}

	const pkg = JSON.parse(readFileSync(pkgPath, { encoding: 'utf8' })) as MinimalPackageJson;
	const entry: Record<string, string> = {};

	// Derive code entries from exports
	const exports = pkg.exports;
	if (exports) {
		for (const [key, value] of Object.entries(exports)) {
			if (typeof value === 'object' && value !== null && 'types' in value) {
				const typesPath = value['types'];
				if (typeof typesPath === 'string' && typesPath.startsWith('./src/')) {
					const name = key === '.' ? 'index' : key.replace(/^\.\//, '');
					entry[name] = typesPath.replace(/^\.\//, '');
				}
			}
		}
	}

	// Derive bin entries from publishConfig.bin
	const publishBin = pkg.publishConfig?.bin;
	if (publishBin && typeof publishBin === 'object') {
		for (const [, distPath] of Object.entries(publishBin)) {
			if (typeof distPath === 'string' && distPath.startsWith('./dist/')) {
				// ./dist/bin/nuke.js -> src/bin/nuke.ts
				const srcPath = distPath.replace(/^\.\/dist\//, 'src/').replace(/\.js$/, '.ts');
				if (existsSync(p.join(cwd, srcPath))) {
					const name = srcPath.replace(/^src\//, '').replace(/\.ts$/, '');
					entry[name] = srcPath;
				}
			}
		}
	}

	return Object.keys(entry).length > 0 ? entry : { index: 'src/index.ts' };
};

export const DEFAULT_OUT_DIR = 'dist';

/**
 * It's an array because when entry is defined as a single string, the name
 * of the output will be the same as the name of the package. But if it's an
 * array, the name will be the same as the file's name without extensions.
 */
export const DEFAULT_ENTRY = ['src/index.ts'];
export const DEFAULT_EXPORT_FORMATS: LibraryFormats[] = ['es', 'cjs'];
export const DEFAULT_BUILD_TARGET = 'es2022';

/**
 * Common Vite configuration defining
 * - build.target: es2022
 * - build.outDir: 'dist'
 * https://vitejs.dev/config/
 */
export const DEFAULT_VITE_CONFIG: UserConfig = {
	build: {
		target: DEFAULT_BUILD_TARGET,
		outDir: DEFAULT_OUT_DIR,
		emptyOutDir: false,
	},
};

/**
 * A Vite configuration for apps, containing
 * - build.target: es2022
 * - build.outDir: 'dist'
 * from DEFAULT_VITE_CONFIG, and
 * - base: toBaseHref(process.env['BASE_HREF']),
 */
export const DEFAULT_VITE_APP_CONFIG = mergeConfig(DEFAULT_VITE_CONFIG, {
	base: toBaseHref(process.env['BASE_HREF']),
} as UserConfig);

/**
 * Vite configuration for building libraries
 *
 * esbuild does not need to be disabled here to preserve comments as it's
 * expected to generate d.ts files from the ts files when publishing and
 * those will preserve the comments in the d.ts files.
 */
export const DEFAULT_VITE_LIB_CONFIG = mergeConfig(DEFAULT_VITE_CONFIG, {
	build: {
		minify: false,
		sourcemap: true,
		rollupOptions: {
			external: createLazyAutoExternalsFunction(), // I'm always using this, but autolib also adds it with the other defaults if they are not defined
			treeshake: true,
		},
		lib: {
			entry: getLibEntryFromExports(),
			formats: DEFAULT_EXPORT_FORMATS,
		},
	},
} satisfies UserConfig);

/**
 * Vite configuration for building plain JS libraries
 *
 * Disables esbuild to preserve jsdoc comments, and also enables
 * build.rollupOptions.output.preserveModules not to interfere with the paths
 * expected by `vite-plugin-dts`
 */
export const DEFAULT_VITE_JS_LIB_CONFIG = mergeConfig(DEFAULT_VITE_LIB_CONFIG, {
	build: {
		rollupOptions: {
			output: {
				preserveModules: true, // Otherwise type paths would be mangled
			},
		},
	},
	esbuild: false, // esbuild always removes comments, and JSDoc wouldn't work
} satisfies UserConfig);
