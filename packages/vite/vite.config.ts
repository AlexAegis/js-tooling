// autotool:not-managed

import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import {
	DEFAULT_EXPORT_FORMATS,
	DEFAULT_VITE_CONFIG,
	createLazyAutoExternalsFunction,
	getLibEntryFromExports,
} from './src/configs/base-vite.config.js';

export default mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		build: {
			minify: false,
			sourcemap: true,
			rollupOptions: {
				external: createLazyAutoExternalsFunction(),
				treeshake: true,
			},
			lib: {
				entry: getLibEntryFromExports(),
				formats: DEFAULT_EXPORT_FORMATS,
			},
		},
		plugins: [
			...(process.env['BUILD_REASON'] === 'publish' ? [dts({ entryRoot: 'src' })] : []),
		],
	}),
);
