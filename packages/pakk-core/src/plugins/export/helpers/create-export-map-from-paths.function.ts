import type { Defined } from '@alexaegis/common';
import p from 'node:path';
import type { AllBinPathCombinations } from '../../bin/auto-bin.class.js';
import type { AllExportPathCombinations } from '../auto-export.class.js';
import type { EntryPathVariantMap, PathVariantMap } from '../export-map.type.js';
import { stripFileExtension } from './strip-file-extension.function.js';

export interface CreateExportMapFromPathsOptions {
	/**
	 * Where the paths were searched from, can be extended further using
	 * the basepath.
	 */
	srcDir: string;

	/**
	 * Where the bundler will place the resulting files
	 */
	outDir: string;

	/**
	 * The directory where shims for the bins are placed
	 */
	shimDir?: string;

	/**
	 * A path every other path was search from, so in the result they will
	 * be prefixed with this
	 *
	 * @defaultValue '.'
	 */
	basePath?: string;

	/**
	 * What kind of keys shall the resulting object contain?
	 * - If set to 'extensionless-relative-path-from-base' then the keys will
	 *   equal to the input paths minus the extension
	 * - If set to 'extensionless-filename-only' then the keys will be set to
	 *   the filename only.
	 */
	keyKind: 'extensionless-relative-path-from-base' | 'extensionless-filename-only';
}

export type NormalizedCreateExportMapFromPathsOptions = Defined<CreateExportMapFromPathsOptions>;

/**
 * The resulting paths still contain their original extensions.
 */
export const createExportMapFromPaths = <
	Variants extends AllExportPathCombinations | AllBinPathCombinations =
		| AllExportPathCombinations
		| AllBinPathCombinations,
>(
	pathsFromBase: string[],
	options: CreateExportMapFromPathsOptions,
): EntryPathVariantMap<Variants> => {
	const basePath = options.basePath ?? '.';
	const exportMap: EntryPathVariantMap<Variants> = {};

	for (const path of pathsFromBase) {
		const key =
			options.keyKind === 'extensionless-filename-only'
				? stripFileExtension(p.basename(path))
				: './' + stripFileExtension(path);

		const pathVariants: Record<string, string> = {
			'development-to-source': './' + p.posix.join(options.srcDir, basePath, path), // The original full path, not used by default but there's an option if preferred
			'development-to-dist': './' + p.posix.join(options.outDir, path), // It is assumed that files in the outDir replicate their folder structure from the srcDir
			'distribution-to-dist': './' + path,
		};

		if (options.shimDir) {
			pathVariants['development-to-shim'] = './' + p.join(options.shimDir, path);
		}

		exportMap[key] = pathVariants as PathVariantMap<Variants>;
	}

	return exportMap;
};
