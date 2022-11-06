import { globby } from 'globby';
import type { Logger } from './create-vite-plugin-logger.function.js';

import { turnIntoExecutable } from './turn-into-executable.function.js';

export interface MakeJavascriptFilesExecutableOptions {
	/**
	 * @default process.cwd()
	 */
	cwd?: string;

	/**
	 * @default undefined
	 */
	logger?: Logger;
}

export const makeJavascriptFilesExecutable = async (
	path: string | string[],
	options?: MakeJavascriptFilesExecutableOptions
): Promise<void> => {
	const dirtectoryContent = await globby(path, { cwd: options?.cwd });
	const executables = dirtectoryContent.filter(
		(bin) => bin.endsWith('js') || bin.endsWith('cjs') || bin.endsWith('mjs')
	);
	await Promise.all(executables.map((executable) => turnIntoExecutable(executable, options)));
};
