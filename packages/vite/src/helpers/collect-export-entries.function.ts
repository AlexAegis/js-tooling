import { readdirSync } from 'node:fs';

import { basename, extname, join } from 'node:path';
import { isObject } from './deep-merge.function.js';
import { existsDirectory } from './exists-directory.function.js';
import { offsetRelativePathPosix } from './offset-relative-path.function.js';

export const collectImmediate = (
	path: string = process.cwd(),
	kind?: 'file' | 'directory'
): string[] => {
	if (existsDirectory(path)) {
		const entries = readdirSync(path, { withFileTypes: true });
		return entries
			.filter((entry) =>
				kind
					? (kind === 'file' && entry.isFile()) ||
					  (kind === 'directory' && entry.isDirectory())
					: true
			)
			.map((entry) => entry.name);
	} else {
		return [];
	}
};

export const stripExtension = (name: string): string =>
	name.replace(new RegExp(`${extname(name)}$`), '');

/**
 * @param rootPath path entry will be relative to this
 * @param exportPath path from which files are collected
 */
export const collectFileNamePathEntries = (
	rootPath: string,
	exportPath = '.'
): Record<string, string> => {
	const collectPath = join(rootPath, exportPath);
	return collectImmediate(collectPath, 'file').reduce((accumulator, next) => {
		const fileName = basename(next);
		const namestub = stripExtension(next);
		accumulator[join(exportPath, namestub)] = fileName;
		return accumulator;
	}, {} as Record<string, string>);
};

export const offsetPathRecord = (
	pathRecord: Record<string, unknown>,
	offsetPath: string,
	skipOffset?: string[]
): Record<string, unknown> => {
	return Object.entries(pathRecord).reduce((result, [key, path]) => {
		if (typeof path === 'string') {
			if (skipOffset?.includes(path)) {
				result[key] = path;
			} else {
				result[key] = offsetRelativePathPosix(offsetPath, path);
			}
		} else if (isObject(path)) {
			result[key] = offsetPathRecord(path, offsetPath);
		}
		return result;
	}, {} as Record<string, unknown>);
};
