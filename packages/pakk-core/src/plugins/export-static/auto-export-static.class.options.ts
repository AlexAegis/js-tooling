import type { Defined } from '@alexaegis/common';
import { DEFAULT_STATIC_EXPORT_GLOBS } from '../../internal/defaults.const.js';
import type { AutoExportAndExportStaticCommonOptions } from '../export/auto-export.class.options.js';

export interface AutoExportStaticOptions extends AutoExportAndExportStaticCommonOptions {
	/**
	 * ### AutoExportStatic
	 *
	 * Relative to cwd, a folder whats content will be simply copied to
	 * `outDir` and made available using simple, additional export statements.
	 * Make sure their names don't overlap with other exports!
	 *
	 * @defaultValue ["readme.md", "static/\*\*", "export/**"]
	 */
	staticExports?: string[] | undefined;
}

export type NormalizedAutoExportStaticOptions = Defined<AutoExportStaticOptions>;

export const normalizeAutoExportStaticOptions = (
	options?: AutoExportStaticOptions,
): NormalizedAutoExportStaticOptions => {
	return {
		staticExports: options?.staticExports ?? DEFAULT_STATIC_EXPORT_GLOBS,
		exportPackageJson: options?.exportPackageJson ?? true,
	};
};
