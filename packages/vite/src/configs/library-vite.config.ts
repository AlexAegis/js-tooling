import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { autolib } from '../plugins/index.js';
import { DEFAULT_VITE_CONFIG } from './base-vite.config.js';

export const libraryViteConfig = mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		plugins: [
			autolib({
				packageJsonTarget: 'build', // TODO: libraries importing other libraries with the 'source' option are not building
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
