import { posix } from 'node:path';

/**
 * Moves one directory in into a path. It strips one directory off from
 * the beginning. if it started with a `./` it keeps it.
 * @example 'foo/bar/file' => 'bar/file'
 */
export const enterPathPosix = (path: string, enterCount = 1): string => {
	const explodedPath = posix.normalize(path).split(posix.sep);
	const directoryCount = explodedPath.length - 1;
	explodedPath.splice(0, Math.min(enterCount, directoryCount));
	const prefix = path.startsWith('./') ? './' : '';
	return prefix + posix.join(...explodedPath);
};
