import { lstatSync } from 'node:fs';

export const existsFile = (path: string): boolean =>
	lstatSync(path, { throwIfNoEntry: false })?.isFile() ?? false;
