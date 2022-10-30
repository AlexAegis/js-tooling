import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { autoPackagePlugin } from '../plugins';
import { baseViteConfig } from './base-vite.config';

export const libraryViteConfig = mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [
			autoPackagePlugin({}),
			viteStaticCopy({
				targets: [
					{
						src: '*.md',
						dest: '.',
					},
					{
						src: 'assets/*',
						dest: './assets',
					},
				],
			}),
			dts({
				insertTypesEntry: true,
				tsConfigFilePath: 'tsconfig.lib.json',
				entryRoot: 'src',
			}),
		],
	})
);
