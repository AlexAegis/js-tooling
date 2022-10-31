import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { autoPackagePlugin } from '../plugins/index.js';
import { baseViteConfig } from './base-vite.config.js';

export const libraryViteConfig = mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [
			autoPackagePlugin({}),
			dts({
				copyDtsFiles: true,
				insertTypesEntry: true,
				tsConfigFilePath: 'tsconfig.json',
				entryRoot: 'src',
			}),
		],
	})
);
