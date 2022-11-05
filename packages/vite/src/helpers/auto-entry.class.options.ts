import type { LibraryFormats } from 'vite';
import { DEFAULT_OUT_DIR } from '../index.js';
import { DEFAULT_SRC_DIR } from '../plugins/autolib.plugin.options.js';

export const DEFAULT_ENTRY_DIR = './';
export const DEFAULT_EXPORT_FORMATS: LibraryFormats[] = ['es', 'cjs'];

export interface AutoEntryOptions {
	/**
	 * @default process.cwd()
	 */
	cwd?: string;

	/**
	 * @default 'src'
	 */
	sourceDirectory?: string;

	/**
	 * @default '["es", "cjs"]'
	 */
	formats?: LibraryFormats[];

	/**
	 * @default 'dist'
	 */
	outDir?: string;

	/**
	 * The files to treat as entry points to be exported from relative from
	 * the `srcDir` directory.
	 * It's usually `.` meaning files directly in `src` are considered the
	 * entry points of the library
	 *
	 * @default '.'
	 */
	entryDir?: string;
}

export const normalizeAutoEntryOptions = (
	options: AutoEntryOptions
): Required<AutoEntryOptions> => {
	return {
		cwd: options.cwd ?? process.cwd(),
		entryDir: options.entryDir ?? DEFAULT_ENTRY_DIR,
		formats: options.formats ?? DEFAULT_EXPORT_FORMATS,
		outDir: options.outDir ?? DEFAULT_OUT_DIR,
		sourceDirectory: options.sourceDirectory ?? DEFAULT_SRC_DIR,
	};
};
