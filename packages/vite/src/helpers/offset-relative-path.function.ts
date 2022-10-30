import { join, sep } from 'node:path/posix';

/**
 * A regular posix join, but adds a `./` at the beginning
 */
export const offsetRelativePathPosix = (offsetPath: string, path: string): string => {
	return `.${sep}${join(offsetPath, path)}`;
};
