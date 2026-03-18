// Standalone vite config — this package is a transitive dependency of
// pakk-vite-plugin, so it cannot import from pakk-vite-plugin source.
import { existsSync, readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import p, { join, normalize } from 'node:path';
import { defineConfig, type LibraryFormats } from 'vite';

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
	options?: { cwd?: string; maxPackages?: number },
): string[] => {
	const cwd = options?.cwd ?? process.cwd();
	const maxPackages = options?.maxPackages ?? 2;
	const results: string[] = [];
	const packages: string[] = [];
	let current = normalize(cwd);
	while (packages.length < maxPackages) {
		if (existsSync(join(current, fileName))) {
			results.unshift(current);
		}
		if (existsSync(join(current, PACKAGE_JSON_NAME))) {
			packages.unshift(current);
		}
		const parent = join(current, '..');
		if (parent === current) break;
		current = parent;
	}
	return results;
};

const createRollupExternalsFn = (...packageJsons: PackageJson[]) => {
	const dependencyNames: string[] = [];
	for (const packageJson of packageJsons) {
		if (packageJson.name) dependencyNames.push(packageJson.name);
		if (packageJson.dependencies)
			dependencyNames.push(...Object.keys(packageJson.dependencies));
		if (packageJson.devDependencies)
			dependencyNames.push(...Object.keys(packageJson.devDependencies));
		if (packageJson.peerDependencies)
			dependencyNames.push(...Object.keys(packageJson.peerDependencies));
		if (packageJson.optionalDependencies)
			dependencyNames.push(...Object.keys(packageJson.optionalDependencies));
	}
	return (source: string) =>
		dependencyNames.some((dep) => source === dep || source.startsWith(dep + '/')) ||
		builtinModules.includes(source) ||
		source.startsWith('node:');
};

const createLazyAutoExternalsFunction = () => {
	let externalsFn: ((source: string) => boolean) | undefined;
	return (source: string, _importer: string | undefined, _isResolved: boolean) => {
		externalsFn ??= createRollupExternalsFn(
			...collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, { maxPackages: 2 }).map(
				(path) =>
					JSON.parse(
						readFileSync(p.join(path, PACKAGE_JSON_NAME), 'utf8'),
					) as PackageJson,
			),
		);
		return externalsFn(source);
	};
};

export const DEFAULT_ENTRY: string[] = ['src/index.ts', 'src/mocks.ts'];
export const DEFAULT_EXPORT_FORMATS: LibraryFormats[] = ['es', 'cjs'];

export default defineConfig({
	build: {
		target: 'es2022',
		outDir: 'dist',
		minify: false,
		sourcemap: true,
		rollupOptions: {
			external: createLazyAutoExternalsFunction(),
			treeshake: true,
		},
		lib: {
			entry: DEFAULT_ENTRY,
			formats: DEFAULT_EXPORT_FORMATS,
		},
	},
});
