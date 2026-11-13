// autotool:not-managed
import {
	DEFAULT_EXPORT_FORMATS,
	DEFAULT_VITE_CONFIG,
	createLazyAutoExternalsFunction,
} from '@alexaegis/vite';
import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		build: {
			minify: false,
			sourcemap: true,
			rolldownOptions: {
				external: createLazyAutoExternalsFunction(),
				treeshake: true,
				output: {
					preserveModules: true,
				},
			},
			lib: {
				entry: ['src/index.js'],
				formats: DEFAULT_EXPORT_FORMATS,
			},
		},
		plugins: [
			// src/internal/types.d.ts has no .js module, so dts copies it only with copyDtsFiles
			...(process.env['BUILD_REASON'] === 'publish'
				? [
						dts({
							entryRoot: 'src',
							include: ['src'],
							exclude: [
								'src/**/*.{spec,test}.?(c|m)[jt]s?(x)',
								'src/**/__tests__/**',
								'src/**/__mocks__/**',
							],
							copyDtsFiles: true,
						}),
					]
				: []),
		],
	}),
);
