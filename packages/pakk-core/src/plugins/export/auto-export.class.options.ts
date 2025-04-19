import type { Defined } from '@alexaegis/common';
import { PackageJsonExportTarget } from '../../index.js';
import {
	DEFAULT_PACKAGE_EXPORTS,
	DEFAULT_PACKAGE_EXPORT_BASEDIR,
	DEFAULT_PACKAGE_EXPORT_IGNORES,
} from '../../internal/defaults.const.js';

export const DEFAULT_PACKAGE_JSON_EXPORT_PATH = './package.json';

export interface AutoExportAndExportStaticCommonOptions {
	/**
	 * Whether or not automatically export the package.json file too.
	 *
	 * Note: If you want to refer to the actual distributed
	 * package.json in your scripts, you should import it through an export
	 * and not use a direct json import, your bundler will bundle your
	 * compile time package.json in, and your users will end up using that
	 * information, not what was published.
	 *
	 * @defaultValue true
	 */
	exportPackageJson?: boolean | undefined;
}

export interface AutoExportOptions extends AutoExportAndExportStaticCommonOptions {
	/**
	 * ### AutoExport
	 *
	 * The files to treat as entry points to be exported from relative from
	 * the `srcDir + exportBaseDir` directory.
	 * It's usually `*` meaning all files directly here are considered the
	 * entry points of the library.
	 *
	 * @defaultValue '*'
	 */
	exports?: string | string[] | undefined;

	/**
	 * ### AutoExport
	 *
	 * What paths to ignore when collecting exports in addition to
	 * `defaultExportsIgnore` so you're not dropping the defaults when you just
	 * want to add additional ignore entries.
	 *
	 * @defaultValue undefiend
	 */
	exportsIgnore?: string[] | undefined;

	/**
	 * ### AutoExport
	 *
	 * By default test files are excluded.
	 *
	 * This option is here if you deliberately want to drop the default ignores.
	 * Otherwise use `exportsIgnore`.
	 *
	 * @defaultValue '*.(spec|test).*'
	 */
	defaultExportsIgnore?: string[] | undefined;

	/**
	 * ### AutoExport
	 *
	 * Relative path to `srcDir` if you want your exports to start from a
	 * different directory.
	 *
	 * @example With the default settings src/index.ts will be the "." export
	 * on your package json. If `exportBaseDir` is set to 'api' then
	 * "src/api/index.ts" will be the "." export. If on top of this, you
	 * change exports to be ["*", "sub/*"]
	 *
	 * @defaultValue '.'
	 */
	exportBaseDir?: string | undefined;

	/**
	 * Where should exports point to in your development packageJson file
	 *
	 * By default, to let you develop locally with the same code as you'd
	 * publish, the development packageJson targets the outDir where your
	 * built package is supposed to be. This expects you to build the package
	 * before running it. (Turbo can orchestrate this for you!)
	 *
	 * But if you wish your local packages to use the source code directly
	 * you can set this to 'source' and then exports will point inside your
	 * 'src' folder. This can be useful for packages that are not transpiled
	 * and are supposed to be used as is.
	 *
	 * Types always point to the source dir so the typescript LSP can provide
	 * real-time feedback in other packages too without having to rebuild all
	 * the time!
	 *
	 * @defaultValue 'dist'
	 */
	developmentPackageJsonExportsTarget?: 'dist' | 'source' | undefined;

	/**
	 * Add svelte export conditions or not
	 *
	 * @defaultValue false
	 */
	svelte?: boolean | undefined;
}

export type NormalizedAutoExportOptions = Defined<AutoExportOptions>;

export const normalizeAutoExportOptions = (
	options?: AutoExportOptions,
): NormalizedAutoExportOptions => {
	return {
		exports: options?.exports ?? DEFAULT_PACKAGE_EXPORTS,
		exportsIgnore: options?.exportsIgnore ?? [],
		defaultExportsIgnore: options?.defaultExportsIgnore ?? DEFAULT_PACKAGE_EXPORT_IGNORES,
		exportBaseDir: options?.exportBaseDir ?? DEFAULT_PACKAGE_EXPORT_BASEDIR,
		developmentPackageJsonExportsTarget:
			options?.developmentPackageJsonExportsTarget ?? PackageJsonExportTarget.DIST,
		svelte: options?.svelte ?? false,
		exportPackageJson: options?.exportPackageJson ?? true,
	};
};
