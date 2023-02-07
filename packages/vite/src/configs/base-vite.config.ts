import { defineConfig, LibraryFormats, mergeConfig } from 'vite';

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
		lib: {
			entry: DEFAULT_ENTRY,
			formats: DEFAULT_EXPORT_FORMATS,
		},
	},
});
