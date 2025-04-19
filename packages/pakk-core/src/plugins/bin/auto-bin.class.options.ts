import type { Defined } from '@alexaegis/common';
import {
	DEFAULT_BINSHIM_DIR,
	DEFAULT_BIN_DIR,
	DEFAULT_BIN_GLOB,
	DEFAULT_PACKAGE_EXPORT_IGNORES,
} from '../../internal/defaults.const.js';
import { ALL_NPM_HOOKS } from '../../package-json/package-json-npm-hooks.const.js';

export interface AutoBinOptions {
	/**
	 * ### AutoBin
	 *
	 * The files to treat as bins elative from the `srcDir + binBaseDir`
	 * directory.
	 * It's usually `*` meaning all files directly here are considered the
	 * entry points of the library.
	 *
	 * @defaultValue '*'
	 */
	bins?: string | string[] | undefined;

	/**
	 * ### AutoBin
	 *
	 * What paths to ignore when collecting bins in addition to
	 * `defaultBinIgnore` so you're not dropping the defaults when you just
	 * want to add additional ignore entries.
	 *
	 * @defaultValue []
	 */
	binIgnore?: string[] | undefined;

	/**
	 * ### AutoBin
	 *
	 * By default test files are excluded
	 *
	 * @defaultValue ['*.(spec|test).*']
	 */
	defaultBinIgnore?: string[] | undefined;

	/**
	 * ### AutoBin
	 *
	 * Relative path from `srcDir` if you want your exports to start from a
	 * different directory.
	 *
	 * @defaultValue 'bin'
	 */
	binBaseDir?: string | undefined;

	/**
	 * ### AutoBin
	 *
	 * If a bin's name matches with an entry here (which is by default every
	 * NPM hook, 'postinstall' 'prebuild' etc.) then it will be automatically
	 * added to your packageJson file's scripts. To not interfere with
	 * development, hooks invoked during install are disabled for the source
	 * packageJson and are only avilable in the distributed packageJson.
	 *
	 * @defaultValue ALL_NPM_HOOKS
	 */
	enabledNpmHooks?: string[] | undefined;

	/**
	 * ### AutoBin
	 *
	 * A directory where shims for the built bins would be placed
	 * All these scripts do is to import the yet-to-be-built binary so
	 * package managers hava something to symlink to before it's built.
	 *
	 * ! This folder has to be ignored by typescript as it contains broken
	 * ! imports before the package is built
	 *
	 * @defaultValue 'shims'
	 */
	shimDir?: string | undefined;
}

export type NormalizedAutoBinOptions = Defined<AutoBinOptions>;

export const normalizeAutoBinOptions = (options?: AutoBinOptions): NormalizedAutoBinOptions => {
	return {
		binBaseDir: options?.binBaseDir ?? DEFAULT_BIN_DIR,
		bins: options?.bins ?? DEFAULT_BIN_GLOB,
		shimDir: options?.shimDir ?? DEFAULT_BINSHIM_DIR,
		defaultBinIgnore: options?.defaultBinIgnore ?? DEFAULT_PACKAGE_EXPORT_IGNORES,
		binIgnore: options?.binIgnore ?? [],
		enabledNpmHooks: options?.enabledNpmHooks ?? ALL_NPM_HOOKS,
	};
};
