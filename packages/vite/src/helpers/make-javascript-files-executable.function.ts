import { globby } from 'globby';

import { turnIntoExecutable } from './turn-into-executable.function.js';

export const makeJavascriptFilesExecutable = async (
	path: string | string[],
	cwd: string = process.cwd()
): Promise<void> => {
	const dirtectoryContent = await globby(path, { cwd });
	const executables = dirtectoryContent.filter(
		(bin) => bin.endsWith('js') || bin.endsWith('cjs') || bin.endsWith('mjs')
	);
	await Promise.all(executables.map((executable) => turnIntoExecutable(executable)));
};
