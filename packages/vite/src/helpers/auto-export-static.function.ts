import { cpSync, mkdirSync } from 'node:fs';
import { join, posix } from 'node:path';
import { collectImmediate, stripExtension } from './collect-export-entries.function';
import { existsDirectory } from './exists-directory.function';

export const DEFAULT_STATIC_EXPORT_DIR = 'export';

export interface AutoExportStaticOptions {
	outDir: string;
	/**
	 * Relative to packageJson, a folder whats content will be simply copied to
	 * `outDir` and made available using simple, additional export statements.
	 * Make sure their names don't overlap with other exports!
	 *
	 * @default 'exports'
	 */
	staticExportDirectory?: string;
}

const collectStaticExports = (path: string): Record<string, string> => {
	return collectImmediate(path).reduce((accumulator, next) => {
		const name = stripExtension(next);
		accumulator[`.${posix.sep}${name}`] = `.${posix.sep}${posix.join(path, next)}`;
		return accumulator;
	}, {} as Record<string, string>);
};

const copyStaticExports = (exportDirectory: string, outDirectory: string): void => {
	console.log(
		'copyStaticExports copyStaticExports',
		exportDirectory,
		existsDirectory(exportDirectory),
		outDirectory
	);
	if (existsDirectory(exportDirectory)) {
		const targetDirectory = join(outDirectory, exportDirectory);

		mkdirSync(targetDirectory, { recursive: true });

		cpSync(exportDirectory, join(outDirectory, exportDirectory), {
			preserveTimestamps: true,
			recursive: true,
		});
	}
};

export const autoStaticExport = (options: AutoExportStaticOptions): Record<string, string> => {
	const staticExportDirectory = options.staticExportDirectory ?? DEFAULT_STATIC_EXPORT_DIR;
	const staticExports = collectStaticExports(staticExportDirectory);
	copyStaticExports(staticExportDirectory, options.outDir);

	return staticExports;
};
