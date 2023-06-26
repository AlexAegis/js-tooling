import { builtinModules } from 'node:module';
import { defineConfig } from 'vite';
import { pakk } from 'vite-plugin-pakk';
import packageJson from './package.json';

// This package can't use the vite-plugin as that's depending on this package and this has to be built first.
// But if it's pre-built with a minimal setup like this without the vite-plugin, then it can be re-built with the real plugin.
// That's why this build only has one output format and no dts generation. It will be immediately discarded.
export default defineConfig({
	build: {
		target: 'es2022',
		outDir: 'dist',
		rollupOptions: {
			external: (source: string): boolean => {
				return (
					[
						...Object.keys(packageJson.dependencies),
						...Object.keys(packageJson.devDependencies),
					].includes(source) ||
					builtinModules.includes(source) ||
					source.startsWith('node:')
				);
			},
		},
		lib: {
			entry: ['src/index.ts'],
			formats: ['es'],
		},
	},
	plugins: [pakk()],
});
