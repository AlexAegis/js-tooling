import { globby } from 'globby';
import { basename, posix } from 'node:path';
import { stripFileExtension } from './strip-file-extension.function.js';

export const collectFileMap = async (
	cwd: string,
	globs: string[],
	keyOnlyFilename = false,
	nonRelativeKey = false
): Promise<Record<string, string>> => {
	const globbyResult = await globby(globs, { cwd, dot: true });
	return globbyResult.reduce((accumulator, next) => {
		const name = stripFileExtension(next);
		const key = keyOnlyFilename
			? basename(name)
			: nonRelativeKey
			? name
			: `.${posix.sep}${name}`;
		accumulator[key] = `.${posix.sep}${next}`;
		return accumulator;
	}, {} as Record<string, string>);
};
