import { DEFAULT_STATIC_EXPORT_GLOBS } from '@pakk/core';
import type { Argv } from 'yargs';

export const yargsForAutoExportStatic = (yargs: Argv<unknown>): Argv<unknown> => {
	return yargs.group(['staticExports'], 'auto-export-static').option('staticExports', {
		description:
			' Relative to cwd, a folder whats content will be simply copied to' +
			'`outDir` and made available using simple, additional export statements.' +
			"Make sure their names don't overlap with other exports!",
		string: true,
		array: true,
		default: DEFAULT_STATIC_EXPORT_GLOBS,
	});
};
