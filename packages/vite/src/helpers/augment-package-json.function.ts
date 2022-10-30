import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { readdirSync } from 'node:fs';

import { join, posix } from 'node:path';
import type { InputOption } from 'rollup';
import type { LibraryFormats } from 'vite';
import { appendBundleFileExtension } from './append-bundle-file-extension.function';
import { cloneJsonSerializable } from './clone-json-serializable.function';
import { stripExtension } from './collect-export-entries.function';
import { turnIntoExecutable } from './turn-into-executable.function';

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
}

export interface AutoBinOptions {
	/**
	 * the same input config used by vite/rollup
	 */
	binInputs: InputOption;
	/**
	 * relative to src
	 */
	binDirectory: string;
	formats: LibraryFormats[];

	/**
	 * Relative to the package.json, usually './dist'
	 *
	 * used to mark the built scripts as executable
	 */
	outDir: string;
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
			const typesPath = `.${posix.sep}${posix.join(exportFromDirectory, `${input}.d.ts`)}`;
			const exportConditions: PackageJsonExportConditions = {
				types: typesPath,
			};

			if (hasCjs) {
				const bundlePath = `.${posix.sep}${posix.join(
					exportFromDirectory,
					appendBundleFileExtension('cjs', input, packageJson.type)
				)}`;
				exportConditions.default = bundlePath;
				exportConditions.require = bundlePath;
			}

			if (hasEs) {
				const bundlePath = `.${posix.sep}${posix.join(
					exportFromDirectory,
					appendBundleFileExtension('es', input, packageJson.type)
				)}`;
				exportConditions.default = bundlePath;
				exportConditions.import = bundlePath;
			}

			if (hasUmd) {
				exportConditions.default = `.${posix.sep}${posix.join(
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
				accumulator[`.${posix.sep}${inputBasename}`] = exportConditions;
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
	const hasCjs = options.formats.includes('cjs');
	const hasEs = options.formats.includes('es');
	const hasUmd = options.formats.includes('umd');

	packageJson.bin = Object.entries(options.binInputs).reduce((result, [key, value]) => {
		const fileName = stripExtension(value);
		if (hasCjs) {
			result[key] = appendBundleFileExtension('cjs', fileName, packageJson.type);
		} else if (hasUmd) {
			result[key] = appendBundleFileExtension('umd', fileName, packageJson.type);
		} else if (hasEs) {
			result[key] = appendBundleFileExtension('es', fileName, packageJson.type);
		} else {
			result[key] = `${fileName}.js`;
		}
		return result;
	}, {} as Record<string, string>);

	packageJson.directories = { ...packageJson.directories, bin: options.binDirectory };

	const binOutputDirectory = join(options.outDir, options.binDirectory);
	const executables = readdirSync(binOutputDirectory)
		.map((bin) => join(binOutputDirectory, bin))
		.filter((bin) => bin.endsWith('js') || bin.endsWith('cjs') || bin.endsWith('mjs'));
	for (const executable of executables) {
		turnIntoExecutable(executable);
	}

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
