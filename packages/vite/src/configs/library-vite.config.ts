import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { autoPackagePlugin } from '../plugins';
import { baseViteConfig } from './base-vite.config';

export const libraryViteConfig = mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [
			autoPackagePlugin({ dry: true }),
			viteStaticCopy({
				targets: [
					{
						src: '*.md',
						dest: '.',
					},
				],
			}),
			dts({
				insertTypesEntry: true,
				tsConfigFilePath: 'tsconfig.lib.json',
				entryRoot: 'src',
			}),
		],
		build: {
			sourcemap: true,
			manifest: true,
			ssr: true,
			lib: {
				entry: 'src/index.ts',
				formats: ['es', 'cjs'],
			},
		},
	})
);
