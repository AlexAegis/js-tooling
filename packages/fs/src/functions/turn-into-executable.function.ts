import type { Stats } from 'node:fs';
import { chmod, lstat, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { SHEBANG_SEQUENCE, shebangs } from './shebangs.const.js';
import { toAbsolute } from './to-absolute.function.js';
import {
	normalizeTurnIntoExecutableOptions,
	type TurnIntoExecutableOptions,
} from './turn-into-executable.function.options.js';

/**
 * Marks a file as executable for its user, and only readable for everyone else
 * If an appropriate shebang is found, it's also prefixed to the top of the
 * file, unless it's already starting with a shebang
 */
export const turnIntoExecutable = async (
	file: string,
	rawOptions?: TurnIntoExecutableOptions,
): Promise<void> => {
	const options = normalizeTurnIntoExecutableOptions(rawOptions);
	const filePath = toAbsolute(file, options);
	let fileStats: Stats;
	try {
		fileStats = await lstat(filePath);
	} catch {
		options.logger.error(`can't turn ${file} into executable, doesn't exist in ${options.cwd}`);
		return;
	}

	if (!fileStats.isFile()) {
		options.logger.error(`can't turn ${file} into executable, not a file`);
		return;
	}

	const extension = extname(filePath);

	const shebang = shebangs[extension];

	if (shebang) {
		try {
			const rawFile = await readFile(filePath, {
				encoding: 'utf8',
			});

			if (!rawFile.startsWith(SHEBANG_SEQUENCE)) {
				const rawFileWithShebang = `${shebang}\n\n${rawFile}`;
				await writeFile(filePath, rawFileWithShebang);
				options.logger.info(`prefixed ${file} with shebang: ${shebang}`);
			}
		} catch (error) {
			options.logger.error("can't prepend file with shebang", error);
		}
	}

	if (!(fileStats.mode & 0o111)) {
		try {
			await chmod(filePath, 0o744);
			options.logger.info(`marked ${file} as executable`);
		} catch (error) {
			options.logger.error(`cannot chmod ${file}, error:`, error);
		}
	}
};
