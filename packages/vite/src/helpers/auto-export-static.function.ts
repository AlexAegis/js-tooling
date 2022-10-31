import { globby } from 'globby';
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join, posix } from 'node:path';
import { stripExtension } from './collect-export-entries.function.js';

export const DEFAULT_STATIC_EXPORT_GLOB = ['static/**/*', 'export/**/*', '*.md'];

export interface AutoExportStaticOptions {
	cwd: string;
	/**
	 * relative to cwd, this is where copied files will end up
	 */
	outDir: string;
	/**
	 * Relative to cwd, a folder whats content will be simply copied to
	 * `outDir` and made available using simple, additional export statements.
	 * Make sure their names don't overlap with other exports!
	 *
	 * @default '["exports", "*.md"]'
	 */
	staticExportGlobs?: string[];
}

const collectStaticExports = async (
	cwd: string,
	globs: string[]
): Promise<Record<string, string>> => {
	console.log('cwq', cwd, globs, process.cwd());

	console.log(readdirSync(cwd));
	const globbyResult = await globby(globs, { cwd, dot: true });
	console.log('globby result', globbyResult);
	return globbyResult.reduce((accumulator, next) => {
		console.log('processing GLOBBY RESULT', next);
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

export const autoStaticExport = async (
	options: AutoExportStaticOptions
): Promise<Record<string, string>> => {
	const staticExportGlobs = options.staticExportGlobs ?? DEFAULT_STATIC_EXPORT_GLOB;
	console.log('staticExportDirectory', options.cwd, staticExportGlobs);
	const staticExports = await collectStaticExports(options.cwd, staticExportGlobs);
	console.log('staticExports', staticExports);
	copyStaticExports(Object.values(staticExports), options.outDir);

	return staticExports;
};
