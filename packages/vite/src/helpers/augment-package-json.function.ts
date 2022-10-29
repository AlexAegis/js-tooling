import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { sep } from 'node:path/posix';
import type { LibraryFormats } from 'vite';
import { bundleFileNameFormatter } from './bundlefilename-formatter.function';
import { collectFileNamePathEntries } from './collect-export-entries.function';

export const DEFAULT_SRC_DIR = 'src';
export const DEFAULT_BIN_DIR = 'bin';
export const DEFAULT_EXPORTS_DIR = '.';

export interface AutoExportOptions {
	formats: LibraryFormats[];
	/**
	 * @default 'src'
	 */
	srcDir?: string;

	/**
	 * The directory from which the exports are exported from relative from
	 * the srcDir.
	 * It's usually `.` from a built package artifact and `./dist`
	 * from the source. Do not end it with a `/` !
	 *
	 * @default '.'
	 */
	exportDir?: string;
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
	 */
	autoExport?: AutoExportOptions;
	/**
	 * Generates bin entries
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

	const exportDirectory = options.exportDir ?? DEFAULT_EXPORTS_DIR;
	const sourceDirectory = options.srcDir ?? DEFAULT_SRC_DIR;

	const inputs = collectFileNamePathEntries(sourceDirectory, exportDirectory);

	packageJson.exports = Object.keys(inputs)
		.filter((inputBasename) => !!inputBasename)
		.map((inputBasename) => {
			const exportConditions: PackageJsonExportConditions = {
				types: `${exportDirectory}${sep}${inputBasename}.d.ts`,
			};

			if (hasCjs) {
				const bundlePath = `${exportDirectory}${sep}${bundleFileNameFormatter(
					'cjs',
					inputBasename,
					packageJson.type
				)}`;
				exportConditions.default = bundlePath;
				exportConditions.require = bundlePath;
			}

			if (hasEs) {
				const bundlePath = `${exportDirectory}${sep}${bundleFileNameFormatter(
					'es',
					inputBasename,
					packageJson.type
				)}`;
				exportConditions.default = bundlePath;
				exportConditions.import = bundlePath;
			}

			if (hasUmd) {
				exportConditions.default = `${exportDirectory}${sep}${bundleFileNameFormatter(
					'umd',
					inputBasename,
					packageJson.type
				)}`;
			}

			return { inputBasename, exportConditions };
		})
		.reduce((accumulator, { exportConditions, inputBasename }) => {
			if (inputBasename === 'index') {
				accumulator['.'] = exportConditions;
			} else {
				accumulator[`.${sep}${inputBasename}`] = exportConditions;
			}
			return accumulator;
		}, {} as Record<string, PackageJsonExportConditions>);
	return packageJson;
};

const autoBin = (packageJson: PackageJson, options: AutoBinOptions): PackageJson => {
	const binDirectory = options.binDir ?? DEFAULT_BIN_DIR;
	const sourceDirectory = options.srcDir ?? DEFAULT_SRC_DIR;
	const binEntries = collectFileNamePathEntries(sourceDirectory, binDirectory);
	packageJson.bin = binEntries;
	return packageJson;
};

/**
 * @param packageJson will be mutated!
 */
export const augmentPackageJson = (
	packageJson: PackageJson,
	options?: PackageJsonAugmentOptions
): PackageJson => {
	if (options?.autoExport) {
		packageJson = autoExport(packageJson, options.autoExport);
	}
	if (options?.autoBin) {
		packageJson = autoBin(packageJson, options.autoBin);
	}
	return packageJson;
};
