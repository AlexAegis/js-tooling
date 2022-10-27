import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';

import { defineConfig, LibraryFormats, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { augmentPackageJson, collectExportEntries, PackageJsonAugmentOptions } from '../helpers';
import { updatePackageJsonPlugin } from '../plugins';
import { baseViteConfig, DEFAULT_OUT_DIR } from './base-vite.config';

const exportEntries = collectExportEntries('src');

const formats: LibraryFormats[] = ['es', 'cjs'];

const augmentPackageJsonOptions: PackageJsonAugmentOptions = {
	autoExport: { formats, inputs: Object.keys(exportEntries) },
};
export const libraryViteConfig = mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [
			updatePackageJsonPlugin({
				updater: (packageJson) =>
					augmentPackageJson(packageJson, {
						...augmentPackageJsonOptions,
						autoExport: {
							inputs: [],
							formats: [],
							...augmentPackageJsonOptions.autoExport,
							rootDir: DEFAULT_OUT_DIR,
						},
					}),
			}),
			viteStaticCopy({
				targets: [
					{
						src: 'package.json',
						dest: '.',
						transform: (rawPackageJson) => {
							const packageJson = JSON.parse(rawPackageJson) as PackageJson;
							return JSON.stringify(
								augmentPackageJson(packageJson, augmentPackageJsonOptions)
							);
						},
					},
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
				formats,
			},
			rollupOptions: {
				input: exportEntries,
			},
		},
	})
);
