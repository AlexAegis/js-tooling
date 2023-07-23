import type { LibraryFormats } from 'vite';
import { mergeConfig, type UserConfig } from 'vite';
import { createLazyAutoExternalsFunction } from 'vite-plugin-pakk';
import { toBaseHref } from '../helpers/to-base-href.function.js';

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
			entry: DEFAULT_ENTRY,
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
