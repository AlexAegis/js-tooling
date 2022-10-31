import { globbySync } from 'globby';
import { cpSync, existsSync } from 'node:fs';
import { join, posix } from 'node:path';
import { stripExtension } from './collect-export-entries.function.js';

export const DEFAULT_STATIC_EXPORT_GLOB = ['exports', '*.md'];

export interface AutoExportStaticOptions {
	outDir: string;
	/**
	 * Relative to packageJson, a folder whats content will be simply copied to
	 * `outDir` and made available using simple, additional export statements.
	 * Make sure their names don't overlap with other exports!
	 *
	 * @default '["exports", "*.md"]'
	 */
	staticExportGlobs?: string[];
}

const collectStaticExports = (globs: string[]): Record<string, string> => {
	return globbySync(globs).reduce((accumulator, next) => {
		const name = stripExtension(next);
		accumulator[`.${posix.sep}${name}`] = `.${posix.sep}${next}`;
		return accumulator;
	}, {} as Record<string, string>);
};

const copyStaticExports = (filesToCopy: string[], outDirectory: string): void => {
	for (const fileToCopy of filesToCopy) {
		const targetFile = join(outDirectory, fileToCopy);
		if (existsSync(targetFile)) {
			console.warn(`can't write ${targetFile}, already exists`);
			continue;
		}

		cpSync(fileToCopy, targetFile, {
			preserveTimestamps: true,
			recursive: true,
		});
	}
};

export const autoStaticExport = (options: AutoExportStaticOptions): Record<string, string> => {
	const staticExportDirectory = options.staticExportGlobs ?? DEFAULT_STATIC_EXPORT_GLOB;
	const staticExports = collectStaticExports(staticExportDirectory);
	copyStaticExports(Object.values(staticExports), options.outDir);

	return staticExports;
};
