import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { autolib } from '../plugins/index.js';
import { DEFAULT_VITE_CONFIG } from './base-vite.config.js';

/**
 * The default library config points the source package json to the built
 * artifact
 */
export const libraryViteConfig = mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		plugins: [
			autolib({
				packageJsonTarget: 'build',
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
