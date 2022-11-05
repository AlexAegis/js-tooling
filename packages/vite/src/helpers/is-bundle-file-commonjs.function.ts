import { readFile } from 'node:fs/promises';

export const commonJsMatchers: RegExp[] = [/module\.exports/, /require\(/, /^"use strict"/];
export const esmMatchers: RegExp[] = [/import /, /export /];

export const isBundleFileCjs = async (file: string): Promise<boolean> => {
	const fileContent = await readFile(file, { encoding: 'utf8' });
	const cjsClues = commonJsMatchers.filter((matcher) => matcher.test(fileContent));
	const esmClues = esmMatchers.filter((matcher) => matcher.test(fileContent));
	return cjsClues.length > esmClues.length;
};

export const isBundleFileEsm = async (file: string): Promise<boolean> => {
	const fileContent = await readFile(file, { encoding: 'utf8' });
	const cjsClues = commonJsMatchers.filter((matcher) => matcher.test(fileContent));
	const esmClues = esmMatchers.filter((matcher) => matcher.test(fileContent));
	return cjsClues.length < esmClues.length;
};
