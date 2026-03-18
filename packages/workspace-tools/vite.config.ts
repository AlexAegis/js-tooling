// Standalone vite config — this package is a transitive dependency of
// pakk-vite-plugin, so it cannot import from pakk-vite-plugin source.
import { existsSync, readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import p, { join, normalize } from 'node:path';
import { mergeConfig, type LibraryFormats, type UserConfig } from 'vite';

const PACKAGE_JSON_NAME = 'package.json';
interface PackageJson {
	name?: string;
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	optionalDependencies?: Record<string, string>;
}

const collectFileDirnamePathsUpDirectoryTree = (
	fileName: string,
	options?: { cwd?: string; depth?: number; maxPackages?: number; maxResults?: number },
): string[] => {
	const cwd = options?.cwd ?? process.cwd();
	const maxPackages = options?.maxPackages ?? 2;
	const maxResults = options?.maxResults ?? Number.POSITIVE_INFINITY;
	const maxDepth = options?.depth ?? Number.POSITIVE_INFINITY;

	const results: string[] = [];
	const packages: string[] = [];
	let current = normalize(cwd);
	let depth = maxDepth;

	while (packages.length < maxPackages && results.length < maxResults && depth > 0) {
		if (existsSync(join(current, fileName))) {
			results.unshift(current);
		}
		if (existsSync(join(current, PACKAGE_JSON_NAME))) {
			packages.unshift(current);
		}
		const parent = join(current, '..');
		if (parent === current) break;
		current = parent;
		depth--;
	}

	return results;
};

export const DEFAULT_OUT_DIR = 'dist';
export const DEFAULT_ENTRY = ['src/index.ts', 'src/monorepo.ts', 'src/npm.ts', 'src/sort.ts'];
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

export default mergeConfig(DEFAULT_VITE_LIB_CONFIG, {});
