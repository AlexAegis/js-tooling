import { statSync } from 'node:fs';

export const existsFile = (path: string): boolean =>
	statSync(path, { throwIfNoEntry: false })?.isFile() ?? false;
