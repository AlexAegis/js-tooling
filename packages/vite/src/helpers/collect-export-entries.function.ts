import { existsSync, readdirSync, statSync } from 'node:fs';

import { basename, extname, join } from 'node:path';

export const collectImmediateFiles = (path: string = process.cwd()): string[] => {
	if (existsSync(path) && statSync(path).isDirectory()) {
		const entries = readdirSync(path, { withFileTypes: true });
		return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
	} else {
		return [];
	}
};

/**
 * Only creates export entries for immediate files
 */
export const collectFileNamePathEntries = (
	rootPath: string = process.cwd(),
	folderToExport = '.'
): Record<string, string> => {
	const path = join(rootPath, folderToExport);
	const filesToExport = collectImmediateFiles(path);
	return filesToExport.reduce((accumulator, next) => {
		const fileName = basename(next);
		const namestub = fileName.replace(new RegExp(`${extname(next)}$`), '');
		const exportPath = join(folderToExport, fileName);
		console.log(`Creating export entry for ${exportPath} as ${namestub}`);
		accumulator[namestub] = exportPath;
		return accumulator;
	}, {} as Record<string, string>);
};
