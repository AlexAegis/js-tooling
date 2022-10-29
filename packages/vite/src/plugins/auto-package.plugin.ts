import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LibraryFormats, Plugin } from 'vite';
import { DEFAULT_OUT_DIR } from '../configs';
import {
	augmentPackageJson,
	DEFAULT_BIN_DIR,
	PackageJsonAugmentOptions,
	WriteJsonOptions,
	writeJsonSync,
} from '../helpers';

export interface AutoPackagerPluginOptions extends PackageJsonAugmentOptions, WriteJsonOptions {
	/**
	 * source root
	 * @default 'src'
	 */
	src?: string;

	/**
	 * @default process.cwd()
	 */
	cwd?: string;

	/**
	 * packageJson to modify and put in the artifact
	 * @default './package.json'
	 */
	sourcePackageJson?: string;

	/**
	 * Whether or not to transform the source package json
	 * Useful in a turbo repo where you want to use the built artifact in
	 * other packages, like publishable libraries.
	 * It's best to let `autoPrettier` enabled if this is enabled as the format
	 * @default true
	 */
	editSourcePackageJson?: boolean;
}

/**
 * Packaged formats are defined in config.build.lib.formats, defaults to es and cjs
 * @param options
 * @returns
 */
export const autoPackagePlugin = (options?: AutoPackagerPluginOptions): Plugin => {
	let formats: LibraryFormats[] = ['es', 'cjs'];
	let targetDirectory = DEFAULT_OUT_DIR;

	let isLibrary = false;
	return {
		name: 'auto-package-json',
		apply: 'build',
		config: (config) => {
			if (config.build?.lib) {
				isLibrary = true;

				if (typeof config.build.lib === 'object' && config.build.lib.formats) {
					formats = config.build.lib.formats;
				}
				if (config.build.outDir) {
					targetDirectory = config.build.outDir;
				}
			}
		},
		buildEnd: (error) => {
			if (!isLibrary) {
				console.warn('autoPackagePlugin cant run, not a library');
				return;
			}
			if (error) {
				console.warn('autoPackagePlugin didnt run, error happened during build');
				return;
			}
			const sourcePackageJson = options?.sourcePackageJson ?? 'package.json';
			const cwd = options?.cwd ?? process.cwd();
			const dry = options?.dry ?? false;
			const autoPrettier = options?.autoPrettier ?? true;
			const editSourcePackageJson = options?.editSourcePackageJson ?? true;
			const sourcePackageJsonLocation = join(cwd, sourcePackageJson);
			const targetPackageJsonLocation = join(targetDirectory, sourcePackageJson);

			const rawPackageJson = readFileSync(sourcePackageJsonLocation, {
				encoding: 'utf8',
			});
			const packageJson = JSON.parse(rawPackageJson) as PackageJson;

			if (editSourcePackageJson) {
				const augmentedForSource = augmentPackageJson(packageJson, {
					autoExport: {
						...options?.autoExport,
						formats,
						exportDir: join(
							targetDirectory,
							options?.autoExport?.exportDir ?? DEFAULT_BIN_DIR
						),
					},
					autoBin: {
						...options?.autoBin,
						binDir: join(targetDirectory, options?.autoBin?.binDir ?? DEFAULT_BIN_DIR),
					},
				});
				writeJsonSync(augmentedForSource, sourcePackageJsonLocation, { autoPrettier, dry });
			}

			const augmentedForArtifact = augmentPackageJson(packageJson, {
				autoExport: {
					...options?.autoExport,
					formats,
				},
				autoBin: options?.autoBin,
			});

			writeJsonSync(augmentedForArtifact, targetPackageJsonLocation, { autoPrettier, dry });
		},
	};
};
