import { defineConfig, mergeConfig } from 'vite';
import { autolib } from 'vite-plugin-autolib';
import dts from 'vite-plugin-dts';
import { DEFAULT_VITE_CONFIG } from './base-vite.config.js';

export const libraryViteConfig = mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		plugins: [
			autolib(),
			dts({
				entryRoot: 'src',
			}),
		],
	})
);
