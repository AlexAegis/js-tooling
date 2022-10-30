import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';

import { posix } from 'node:path';
import type { InputOption } from 'rollup';
import type { LibraryFormats } from 'vite';
import { appendBundleFileExtension } from './append-bundle-file-extension.function';
import type { PackageJsonExportConditions } from './package-json-export-conditions.type';

export const DEFAULT_EXPORT_FORMATS: LibraryFormats[] = ['es', 'cjs'];
export const DEFAULT_SRC_DIR = 'src';
export const DEFAULT_BIN_DIR = 'bin';
export const DEFAULT_EXPORT_FROM_DIR = '.';
export const DEFAULT_EXPORT_TO_DIR = 'dist';

export interface AutoExportOptions {
	/**
	 * the same input config used by vite/rollup
	 */
	libraryInputs: InputOption;

	formats: LibraryFormats[];
	outDir: string;

	/**
	 * The directory from which the exports are exported from relative from
	 * the `srcDir` directory.
	 * It's usually `.` meaning files directly in `src` are considered the
	 * entry points of the library
	 *
	 * @default '.'
	 */
	exportFromDir?: string;

	/**
	 * Relative to packageJson, a folder whats content will be simply copied to
	 * `outDir` and made available using simple, additional export statements.
	 * Make sure their names don't overlap with other exports!
	 *
	 * @default 'exports'
	 */
	staticExportDirectory?: string;
}

export const autoExport = (
	packageJson: PackageJson,
	options: AutoExportOptions
): Record<string, PackageJsonExportConditions> => {
	const hasCjs = options.formats.includes('cjs');
	const hasEs = options.formats.includes('es');
	const hasUmd = options.formats.includes('umd');

	const exportFromDirectory = options.exportFromDir ?? DEFAULT_EXPORT_FROM_DIR;

	return Object.keys(options.libraryInputs)
		.map((input) => {
			const typesPath = `.${posix.sep}${posix.join(exportFromDirectory, `${input}.d.ts`)}`;
			const exportConditions: PackageJsonExportConditions = {
				types: typesPath,
			};

			if (hasUmd) {
				exportConditions.require = `.${posix.sep}${posix.join(
					exportFromDirectory,
					appendBundleFileExtension('umd', input, packageJson.type)
				)}`;
			}

			if (hasCjs) {
				const bundlePath = `.${posix.sep}${posix.join(
					exportFromDirectory,
					appendBundleFileExtension('cjs', input, packageJson.type)
				)}`;
				// exportConditions.default = bundlePath;
				exportConditions.require = bundlePath;
			}

			if (hasEs) {
				const bundlePath = `.${posix.sep}${posix.join(
					exportFromDirectory,
					appendBundleFileExtension('es', input, packageJson.type)
				)}`;
				// exportConditions.default = bundlePath;
				exportConditions.import = bundlePath;
			}

			return { inputBasename: input, exportConditions };
		})
		.reduce((accumulator, { exportConditions, inputBasename }) => {
			if (inputBasename === 'index') {
				accumulator['.'] = exportConditions;
			} else {
				accumulator[`.${posix.sep}${inputBasename}`] = exportConditions;
			}
			return accumulator;
		}, {} as Record<string, PackageJsonExportConditions>);

	// // Fallback entries
	// const rootExport: PackageJsonExportConditions | undefined = packageJson.exports['.'];
	// if (rootExport) {
	// 	if (rootExport.default) {
	// 		packageJson.main = rootExport.require ?? rootExport.default;
	// 	}
	// 	if (rootExport.import) {
	// 		packageJson.module = rootExport.import ?? rootExport.default;
	// 	}
	// }
};
