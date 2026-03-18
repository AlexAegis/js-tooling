import { PACKAGE_JSON_NAME } from '../package-json/package-json.interface.js';
import { collectFileDirnamePathsUpDirectoryTree } from './collect-file-dirname-paths-up-directory-tree.function.js';
import type { CollectFileDirnamesUpDirectoryTreeOptions } from './collect-file-dirname-paths-up-directory-tree.function.options.js';

/**
 * Returns the furthest folder where a package.json file is present
 *
 * (If you're searching for the nearest, use the getWorkspaceRoot function)
 *
 * @param cwd process.cwd()
 * @returns
 */
export const getWorkspaceRoot = (
	rawOptions?: CollectFileDirnamesUpDirectoryTreeOptions,
): string | undefined => {
	return collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, rawOptions)[0];
};
