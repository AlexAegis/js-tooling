import type { LibraryFormats } from 'vite';
import { DEFAULT_OUT_DIR } from '../configs/base-vite.config.js';
import { DEFAULT_SRC_DIR } from '../plugins/autolib.plugin.options.js';
import { ALL_NPM_HOOKS } from './auto-bin.class.js';
import { DEFAULT_EXPORT_FORMATS } from './auto-entry.class.options.js';
import { Logger, noopLogger } from './create-vite-plugin-logger.function.js';

export const DEFAULT_BIN_GLOBS = ['bin/*.ts', 'bin/*.js'];

export interface AutoBinOptions {
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
	 * relative to src
	 * @default '["bin/*.ts", "bin/*.js"]'
	 */
	binGlobs?: string[];

	/**
	 * Relative to the package.json, usually './dist'
	 *
	 * used to mark the built scripts as executable
	 *
	 * @default 'dist'
	 */
	outDir?: string;

	/**
	 * The hooks this function will search for
	 * @default ALL_NPM_HOOKS
	 */
	enabledHooks?: string[];

	/**
	 * An optional logger
	 */
	logger?: Logger;
}

export const normalizeAutoBinOptions = (options: AutoBinOptions): Required<AutoBinOptions> => {
	return {
		cwd: options.cwd ?? process.cwd(),
		binGlobs: options.binGlobs ?? DEFAULT_BIN_GLOBS,
		formats: options.formats ?? DEFAULT_EXPORT_FORMATS,
		outDir: options.outDir ?? DEFAULT_OUT_DIR,
		sourceDirectory: options.sourceDirectory ?? DEFAULT_SRC_DIR,
		enabledHooks: options.enabledHooks ?? ALL_NPM_HOOKS,
		logger: options.logger ?? noopLogger,
	};
};
