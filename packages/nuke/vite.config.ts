import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		dts({
			insertTypesEntry: true,
			tsConfigFilePath: 'tsconfig.lib.json',
			entryRoot: 'src',
		}),
	],
	esbuild: {
		target: 'es2020',
	},
	build: {
		manifest: true,
		sourcemap: true,
		lib: {
			entry: 'src/index.ts',
			formats: ['cjs', 'es', 'umd'],
			fileName: (moduleFormat) =>
				`index${moduleFormat === 'cjs' ? '' : '.' + moduleFormat}.js`,
		},
	},
});
