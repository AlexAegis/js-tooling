import { existsSync, readdirSync } from 'node:fs';

import { basename, extname, join } from 'node:path';

export const EXPORT_DIRECTORY = './';

/**
 * Only creates export entries for immediate files
 */
export const collectExportEntries = (
	projectRoot: string = process.cwd()
): Record<string, string> => {
	const exportDirectory = join(projectRoot, EXPORT_DIRECTORY);
	if (existsSync(exportDirectory)) {
		const entries = readdirSync(exportDirectory, { withFileTypes: true });
		const filesToExport = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);

		return filesToExport.reduce((accumulator, next) => {
			const fileName = basename(next);
			const namestub = fileName.replace(new RegExp(`${extname(next)}$`), '');
			const exportPath = join(exportDirectory, fileName);
			console.log(`Creating export entry for ${exportPath} as ${namestub}`);
			accumulator[namestub] = exportPath;
			return accumulator;
		}, {} as Record<string, string>);
	} else {
		return {} as Record<string, string>;
	}
};
