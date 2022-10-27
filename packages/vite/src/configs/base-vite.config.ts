import { defineConfig } from 'vite';

export const DEFAULT_OUT_DIR = './dist';
/**
 * https://vitejs.dev/config/
 */
export const baseViteConfig = defineConfig({
	build: {
		target: 'es2020',
		outDir: DEFAULT_OUT_DIR,
	},
});
