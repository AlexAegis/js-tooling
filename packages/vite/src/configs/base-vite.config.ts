import type { LibraryFormats } from 'vite';
import { defineConfig, mergeConfig } from 'vite';
import { createLazyAutoExternalsFunction } from '../helpers/rollup-externals.function.js';

export const DEFAULT_OUT_DIR = './dist';
export const DEFAULT_ENTRY = './src/index.ts';
export const DEFAULT_EXPORT_FORMATS: LibraryFormats[] = ['es', 'cjs'];
export const DEFAULT_BUILD_TARGET = 'es2022';

/**
 * https://vitejs.dev/config/
 */
export const DEFAULT_VITE_CONFIG = defineConfig({
	build: {
		target: DEFAULT_BUILD_TARGET,
		outDir: DEFAULT_OUT_DIR,
	},
});

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
});
