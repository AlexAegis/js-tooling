import { existsSync } from 'node:fs';
import { extname } from 'node:path';

import { chmod, lstat, readFile, writeFile } from 'node:fs/promises';

export const SHEBANG_SEQUENCE = '#!';
export const SHELL_SHEBANG = '#!/usr/bin/env sh';
export const NODE_SHEBANG = '#!/usr/bin/env node';
export const TSNODE_SHEBANG = '#!/usr/bin/env node --require ts-node/register';

export const shebangs: Record<string, string> = {
	js: NODE_SHEBANG,
	cjs: NODE_SHEBANG,
	mjs: NODE_SHEBANG,
	ts: TSNODE_SHEBANG,
	mts: TSNODE_SHEBANG,
	cts: TSNODE_SHEBANG,
	sh: SHELL_SHEBANG,
};

/**
 * Marks a file as executable for its user, and only readable for everyone else
 * If an appropriate shebang is found, it's also prefixed to the top of the
 * file, unless it's already starting with a shebang
 */
export const turnIntoExecutable = async (file: string): Promise<void> => {
	if (!existsSync(file)) {
		console.error(`can't turn ${file} into executable, doesn't exist`);
		return;
	}
	const fileStats = await lstat(file);
	if (!fileStats.isFile()) {
		console.error(`can't turn ${file} into executable, not a file`);
		return;
	}

	const extension = extname(file);

	if (extension in shebangs) {
		const shebang = shebangs[extension];
		const rawFile = await readFile(file, {
			encoding: 'utf8',
		});
		if (!rawFile.startsWith(SHEBANG_SEQUENCE)) {
			console.log(`prepending ${file} with shebang: ${shebang}`);

			const rawFileWithShebang = `${shebang}\n\n${rawFile}`;
			await writeFile(file, rawFileWithShebang);
		}
	}

	if (!(fileStats.mode & 0o111)) {
		console.log(`marking ${file} as executable...`);
		await chmod(file, 0o744);
	}
};
