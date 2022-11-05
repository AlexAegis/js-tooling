import { defineConfig } from 'vite';

export const DEFAULT_OUT_DIR = './dist';
export const DEFAULT_ENTRY = './src/index.ts';

/**
 * https://vitejs.dev/config/
 */
export const DEFAULT_VITE_CONFIG = defineConfig({
	build: {
		target: 'es2020',
		outDir: DEFAULT_OUT_DIR,
		lib: {
			entry: DEFAULT_ENTRY,
		},
	},
});
