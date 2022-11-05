import { DEFAULT_OUT_DIR } from '../index.js';

export const DEFAULT_STATIC_EXPORT_GLOBS = ['static/**/*', 'export/**/*'];

export interface AutoExportStaticOptions {
	/**
	 * @default process.cwd()
	 */
	cwd?: string;

	/**
	 * relative to cwd, this is where copied files will end up
	 * @default 'dist'
	 */
	outDir?: string;

	/**
	 * Relative to cwd, a folder whats content will be simply copied to
	 * `outDir` and made available using simple, additional export statements.
	 * Make sure their names don't overlap with other exports!
	 *
	 * @default '["static/**", "export/**"]'
	 */
	staticExportGlobs?: string[];
}

export const normalizeAutoExportStaticOptions = (
	rawOptions: AutoExportStaticOptions
): Required<AutoExportStaticOptions> => {
	return {
		cwd: rawOptions.cwd ?? process.cwd(),
		outDir: rawOptions.outDir ?? DEFAULT_OUT_DIR,
		staticExportGlobs: rawOptions.staticExportGlobs ?? DEFAULT_STATIC_EXPORT_GLOBS,
	};
};
