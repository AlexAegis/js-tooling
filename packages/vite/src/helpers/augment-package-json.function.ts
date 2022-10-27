import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { sep } from 'node:path/posix';
import type { LibraryFormats } from 'vite';
import { bundleFileNameFormatter } from './bundlefilename-formatter.function';

export interface PackageJsonAugmentOptions {
	/**
	 * Generates exports entries form rollup inputs
	 */
	autoExport?: {
		/**
		 * Basenames like index for index.ts
		 */
		inputs: string[];
		formats: LibraryFormats[];
		/**
		 * The directory from which the exports are exported from.
		 * It's usually `.` from a built package artifact and `./dist`
		 * from the source. Do not end it with a `/` !
		 */
		rootDir?: string;
	};
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

/**
 * @param packageJson will be mutated!
 */
export const augmentPackageJson = (
	packageJson: PackageJson,
	options?: PackageJsonAugmentOptions
): PackageJson => {
	if (options?.autoExport) {
		const hasCjs = options.autoExport.formats.includes('cjs');
		const hasEs = options.autoExport.formats.includes('es');
		const hasUmd = options.autoExport.formats.includes('umd');

		const rootDirectory = options.autoExport.rootDir ?? '.';

		packageJson.exports = options.autoExport.inputs
			.filter((inputBasename) => !!inputBasename)
			.map((inputBasename) => {
				const exportConditions: PackageJsonExportConditions = {
					types: `${rootDirectory}${sep}${inputBasename}.d.ts`,
				};

				if (hasCjs) {
					const bundlePath = `${rootDirectory}${sep}${bundleFileNameFormatter(
						'cjs',
						inputBasename,
						packageJson.type
					)}`;
					exportConditions.default = bundlePath;
					exportConditions.require = bundlePath;
				}

				if (hasEs) {
					const bundlePath = `${rootDirectory}${sep}${bundleFileNameFormatter(
						'es',
						inputBasename,
						packageJson.type
					)}`;
					exportConditions.default = bundlePath;
					exportConditions.import = bundlePath;
				}

				if (hasUmd) {
					exportConditions.default = `${rootDirectory}${sep}${bundleFileNameFormatter(
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
	}
	return packageJson;
};
