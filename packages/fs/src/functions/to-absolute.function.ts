import { isAbsolute, join } from 'node:path';
import { normalizeCwdOption, type CwdOption } from './cwd.option.js';

/**
 * Normalizes a path to an absolute one
 *
 * @returns an absolue path
 */
export const toAbsolute = (path: string, rawOptions?: CwdOption): string => {
	const options = normalizeCwdOption(rawOptions);
	return isAbsolute(path) ? path : join(options.cwd, path);
};
