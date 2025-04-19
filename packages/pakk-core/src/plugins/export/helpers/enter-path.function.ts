import p from 'node:path';

/**
 * Moves one directory in into a path. It strips one directory off from
 * the beginning. if it started with a `./` it keeps it and strips the next
 * section off.
 *
 * @example 'foo/bar/file' => 'bar/file'
 */
export const enterPathPosix = (path: string, enterCount = 1): string => {
	const explodedPath = p.posix.normalize(path).split(p.posix.sep);
	const directoryCount = explodedPath.length - 1;
	explodedPath.splice(0, Math.min(enterCount, directoryCount));
	const prefix = path.startsWith('./') ? './' : '';
	return prefix + p.posix.join(...explodedPath);
};
