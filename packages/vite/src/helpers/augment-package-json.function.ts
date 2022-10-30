import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { join, sep } from 'node:path/posix';
import type { InputOption } from 'rollup';
import type { LibraryFormats } from 'vite';
import { appendBundleFileExtension } from './append-bundle-file-extension.function';
import { cloneJsonSerializable } from './clone-json-serializable.function';
import { collectFileNamePathEntries } from './collect-export-entries.function';

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

	/**
	 * The directory from which the exports are exported from relative from
	 * the `srcDir` directory.
	 * It's usually `.` meaning files directly in `src` are considered the
	 * entry points of the library
	 *
	 * @default '.'
	 */
	exportFromDir?: string;

	//	/**
	//	 * The directory to which exports are moved to, relative to the resulting
	//	 * package.json file. From the target packageJson it's `.` and from the
	//	 * source packageJson it would be `./dist` or whatever the `outDir` is.
	//	 *
	//	 * @default '.'
	//	 */
	//	exportToDir?: string;
}

export interface AutoBinOptions {
	/**
	 * @default 'src'
	 */
	srcDir?: string;
	/**
	 * The directory relative to srcDir from which the bins are exported from.
	 * Every file directly here is considered an executable
	 * @default  `bin`.
	 */
	binDir?: string;
}

export interface PackageJsonAugmentOptions {
	/**
	 * Generates exports entries form rollup inputs
	 *
	 * @default undefined
	 */
	autoExport?: AutoExportOptions;
	/**
	 * Generates bin entries
	 *
	 * @default undefined
	 */
	autoBin?: AutoBinOptions;
}

/**
 * https://nodejs.org/api/packages.html#exports
 * There are some community conditions that are not indluded. Check here for
 * more: https://nodejs.org/api/packages.html#community-conditions-definitions
 */
export type PackageJsonExportConditions = {
	/**
	 * Community condition.
	 * Can be used by typing systems to resolve the typing file for the given export.
	 * ! This condition should always be included first.
	 */
	types?: string;
	/**
	 * Used by NodeJS
	 */
	default?: string;
	/**
	 * Used by NodeJS
	 */
	import?: string;
	/**
	 * Used by NodeJS
	 */
	node?: string | { import?: string; require?: string };
	/**
	 * Used by NodeJS
	 */
	require?: string;
	/**
	 * Used by Deno
	 */
	deno?: string;
};

const autoExport = (packageJson: PackageJson, options: AutoExportOptions): PackageJson => {
	const hasCjs = options.formats.includes('cjs');
	const hasEs = options.formats.includes('es');
	const hasUmd = options.formats.includes('umd');

	const exportFromDirectory = options.exportFromDir ?? DEFAULT_EXPORT_FROM_DIR;
	packageJson.exports = Object.keys(options.libraryInputs)
		.map((input) => {
			const typesPath = `.${sep}${join(exportFromDirectory, `${input}.d.ts`)}`;
			const exportConditions: PackageJsonExportConditions = {
				types: typesPath,
			};

			if (hasCjs) {
				const bundlePath = `.${sep}${join(
					exportFromDirectory,
					appendBundleFileExtension('cjs', input, packageJson.type)
				)}`;
				exportConditions.default = bundlePath;
				exportConditions.require = bundlePath;
			}

			if (hasEs) {
				const bundlePath = `.${sep}${join(
					exportFromDirectory,
					appendBundleFileExtension('es', input, packageJson.type)
				)}`;
				exportConditions.default = bundlePath;
				exportConditions.import = bundlePath;
			}

			if (hasUmd) {
				exportConditions.default = `.${sep}${join(
					exportFromDirectory,
					appendBundleFileExtension('umd', input, packageJson.type)
				)}`;
			}

			return { inputBasename: input, exportConditions };
		})
		.reduce((accumulator, { exportConditions, inputBasename }) => {
			if (inputBasename === 'index') {
				accumulator['.'] = exportConditions;
			} else {
				accumulator[`.${sep}${inputBasename}`] = exportConditions;
			}
			return accumulator;
		}, {} as Record<string, PackageJsonExportConditions>);

	// Fallback entries
	const rootExport: PackageJsonExportConditions | undefined = packageJson.exports['.'];
	if (rootExport) {
		if (rootExport.default) {
			packageJson.main = rootExport.require ?? rootExport.default;
		}
		if (rootExport.import) {
			packageJson.module = rootExport.import ?? rootExport.default;
		}
	}

	return packageJson;
};

const autoBin = (packageJson: PackageJson, options: AutoBinOptions): PackageJson => {
	const sourceDirectory = options.srcDir ?? DEFAULT_SRC_DIR;
	const binDirectory = options.binDir ?? DEFAULT_BIN_DIR;
	const binEntries = collectFileNamePathEntries(sourceDirectory, binDirectory);
	packageJson.bin = binEntries;
	return packageJson;
};

export const augmentPackageJson = (
	packageJson: PackageJson,
	options?: PackageJsonAugmentOptions
): PackageJson => {
	let clone = cloneJsonSerializable(packageJson);
	if (options?.autoExport) {
		clone = autoExport(clone, options.autoExport);
	}
	if (options?.autoBin) {
		clone = autoBin(clone, options.autoBin);
	}
	return clone;
};
