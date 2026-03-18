import { groupBy } from '@alexaegis/common';
import { findNearestFile } from './find-nearest-file.function.js';

/**
 * Groups together paths based on the nearest path where the filename exists.
 *
 * For example if you have a lot of path's for TS files all over a monorepo and
 * you want to group them by their nearest tsconfig.json file.
 * When you define the second param as 'tsconfig.json' this function will
 * find the nearest 'tsconfig.json' file for every path passed in the first
 * param by walking up its directory chain. The absolute path of that
 * 'tsconfig.json' will be the key of the group.
 */
export const groupByCommonNearestFile = (
	paths: string[],
	filename: string,
): Record<string, string[]> => {
	return groupBy(paths, (path) => findNearestFile(filename, path));
};
