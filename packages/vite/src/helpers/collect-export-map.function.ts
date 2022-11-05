import { globby } from 'globby';
import { posix } from 'node:path';
import { stripFileExtension } from './strip-file-extension.function.js';

export const collectFileMap = async (
	cwd: string,
	globs: string[]
): Promise<Record<string, string>> => {
	const globbyResult = await globby(globs, { cwd, dot: true });
	return globbyResult.reduce((accumulator, next) => {
		const name = stripFileExtension(next);
		accumulator[`.${posix.sep}${name}`] = `.${posix.sep}${next}`;
		return accumulator;
	}, {} as Record<string, string>);
};
