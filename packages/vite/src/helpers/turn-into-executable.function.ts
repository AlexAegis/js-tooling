import { existsSync } from 'node:fs';
import { extname, isAbsolute, join } from 'node:path';

import { chmod, lstat, readFile, writeFile } from 'node:fs/promises';
import type { Logger } from './create-vite-plugin-logger.function.js';

export const SHEBANG_SEQUENCE = '#!';
export const SHELL_SHEBANG = '#!/usr/bin/env sh';
export const NODE_SHEBANG = '#!/usr/bin/env node';
export const TSNODE_SHEBANG = '#!/usr/bin/env node --require ts-node/register';

export const shebangs: Record<string, string> = {
	['.js']: NODE_SHEBANG,
	['.cjs']: NODE_SHEBANG,
	['.mjs']: NODE_SHEBANG,
	['.ts']: TSNODE_SHEBANG,
	['.mts']: TSNODE_SHEBANG,
	['.cts']: TSNODE_SHEBANG,
	['.sh']: SHELL_SHEBANG,
};

export interface TurnIntoExecutableOptions {
	/**
	 * @default process.cwd()
	 */
	cwd?: string;

	/**
	 * @default undefined
	 */
	logger?: Logger;
}

/**
 * Marks a file as executable for its user, and only readable for everyone else
 * If an appropriate shebang is found, it's also prefixed to the top of the
 * file, unless it's already starting with a shebang
 */
export const turnIntoExecutable = async (
	file: string,
	options?: TurnIntoExecutableOptions
): Promise<void> => {
	const cwd = options?.cwd ?? process.cwd();
	const filePath = isAbsolute(file) ? file : join(cwd, file);
	if (!existsSync(filePath)) {
		options?.logger?.error(`can't turn ${file} into executable, doesn't exist in ${cwd}`);
		return;
	}
	const fileStats = await lstat(filePath);
	if (!fileStats.isFile()) {
		options?.logger?.error(`can't turn ${file} into executable, not a file`);
		return;
	}

	const extension = extname(filePath);

	if (Object.hasOwn(shebangs, extension)) {
		const shebang = shebangs[extension];
		const rawFile = await readFile(filePath, {
			encoding: 'utf8',
		});
		if (!rawFile.startsWith(SHEBANG_SEQUENCE)) {
			options?.logger?.log(`prepending ${file} with shebang: ${shebang}`);

			const rawFileWithShebang = `${shebang}\n\n${rawFile}`;
			await writeFile(filePath, rawFileWithShebang);
		}
	}

	if (!(fileStats.mode & 0o111)) {
		options?.logger?.log(`marking ${file} as executable...`);
		await chmod(filePath, 0o744);
	}
};
