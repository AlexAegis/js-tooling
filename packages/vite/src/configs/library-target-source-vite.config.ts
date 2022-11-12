import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { autolib } from '../plugins/index.js';
import { DEFAULT_VITE_LIB_CONFIG } from './base-vite.config.js';

export const libraryTargetSourceViteConfig = mergeConfig(
	DEFAULT_VITE_LIB_CONFIG,
	defineConfig({
		plugins: [
			autolib({
				packageJsonTarget: 'source',
			}),
			dts({
				copyDtsFiles: true,
				insertTypesEntry: true,
				tsConfigFilePath: 'tsconfig.json',
				entryRoot: 'src',
			}),
		],
	})
);
