import { existsSync, readdirSync, statSync } from 'node:fs';

import { basename, extname, join } from 'node:path';
import { isObject } from './deep-merge.function';
import { offsetRelativePathPosix } from './offset-relative-path.function';

export const collectImmediateFiles = (path: string = process.cwd()): string[] => {
	if (existsSync(path) && statSync(path).isDirectory()) {
		const entries = readdirSync(path, { withFileTypes: true });
		return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
	} else {
		return [];
	}
};

/**
 * @param rootPath path entry will be relative to this
 * @param exportPath path from which files are collected
 */
export const collectFileNamePathEntries = (
	rootPath: string,
	exportPath = '.'
): Record<string, string> => {
	const collectPath = join(rootPath, exportPath);
	return collectImmediateFiles(collectPath).reduce((accumulator, next) => {
		const fileName = basename(next);
		const namestub = fileName.replace(new RegExp(`${extname(next)}$`), '');
		accumulator[namestub] = offsetRelativePathPosix(exportPath, fileName);
		return accumulator;
	}, {} as Record<string, string>);
};

export const offsetPathRecord = (
	pathRecord: Record<string, unknown>,
	offsetPath: string
): Record<string, unknown> => {
	return Object.entries(pathRecord).reduce((result, [key, path]) => {
		if (typeof path === 'string') {
			result[key] = offsetRelativePathPosix(offsetPath, path);
		}
		if (isObject(path)) {
			result[key] = offsetPathRecord(path, offsetPath);
		}
		return result;
	}, {} as Record<string, unknown>);
};
