import { statSync } from 'node:fs';

export const existsDirectory = (path: string): boolean =>
	statSync(path, { throwIfNoEntry: false })?.isDirectory() ?? false;
