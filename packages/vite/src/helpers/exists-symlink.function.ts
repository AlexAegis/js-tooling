import { statSync } from 'node:fs';

export const existsSymlink = (path: string): boolean =>
	statSync(path, { throwIfNoEntry: false })?.isSymbolicLink() ?? false;
