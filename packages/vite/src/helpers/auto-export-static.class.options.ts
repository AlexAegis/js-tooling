import { DEFAULT_OUT_DIR } from '../index.js';
import { Logger, noopLogger } from './create-vite-plugin-logger.function.js';

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

	/**
	 * An optional logger
	 */
	logger?: Logger;
}

export const normalizeAutoExportStaticOptions = (
	options: AutoExportStaticOptions
): Required<AutoExportStaticOptions> => {
	return {
		cwd: options.cwd ?? process.cwd(),
		outDir: options.outDir ?? DEFAULT_OUT_DIR,
		staticExportGlobs: options.staticExportGlobs ?? DEFAULT_STATIC_EXPORT_GLOBS,
		logger: options.logger ?? noopLogger,
	};
};
