import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { existsSync, readdirSync, statSync } from 'node:fs';

import { join } from 'node:path';
import type { InputOption } from 'rollup';
import type { LibraryFormats } from 'vite';
import { appendBundleFileExtension } from './append-bundle-file-extension.function.js';
import { stripExtension } from './collect-export-entries.function.js';
import { turnIntoExecutable } from './turn-into-executable.function.js';

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

/**
 * It makes npm generate extensionless entries in node_modules/.bin
 * using packageJson.directories = { ...packageJson.directories, bin: options.binDirectory };
 * would keep every entry as is making you invoke your executables with file endings
 *
 * @param packageJson
 * @param options
 * @returns
 */
export const autoBin = (
	packageJson: PackageJson,
	options: AutoBinOptions
): Record<string, string> => {
	const hasCjs = options.formats.includes('cjs');
	const hasEs = options.formats.includes('es');
	const hasUmd = options.formats.includes('umd');

	const bin = Object.entries(options.binInputs).reduce((result, [key, value]) => {
		const fileName = stripExtension(value);
		if (hasEs) {
			result[key] = appendBundleFileExtension('es', fileName, packageJson.type);
		} else if (hasCjs) {
			result[key] = appendBundleFileExtension('cjs', fileName, packageJson.type);
		} else if (hasUmd) {
			result[key] = appendBundleFileExtension('umd', fileName, packageJson.type);
		} else {
			result[key] = `${fileName}.js`;
		}
		return result;
	}, {} as Record<string, string>);

	const binOutputDirectory = join(options.outDir, options.binDirectory);

	if (existsSync(binOutputDirectory) && statSync(binOutputDirectory).isDirectory()) {
		const executables = readdirSync(binOutputDirectory)
			.map((bin) => join(binOutputDirectory, bin))
			.filter((bin) => bin.endsWith('js') || bin.endsWith('cjs') || bin.endsWith('mjs'));
		for (const executable of executables) {
			turnIntoExecutable(executable);
		}
	}

	return bin;
};
