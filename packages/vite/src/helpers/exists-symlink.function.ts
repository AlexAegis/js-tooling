import { lstatSync } from 'node:fs';

export const existsSymlink = (path: string): boolean =>
	lstatSync(path, { throwIfNoEntry: false })?.isSymbolicLink() ?? false;
