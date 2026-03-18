import { PACKAGE_JSON_NAME } from '../package-json/package-json.interface.js';
import { collectFileDirnamePathsUpDirectoryTree } from './collect-file-dirname-paths-up-directory-tree.function.js';

/**
 * Returns the nearest folder where a package.json file is present
 *
 * (If you're searching for the farthest, use the getCurrentPackageRoot function)
 *
 * @param cwd @default process.cwd()
 * @returns
 */
export const getCurrentPackageRoot = (cwd: string = process.cwd()): string | undefined => {
	return collectFileDirnamePathsUpDirectoryTree(PACKAGE_JSON_NAME, { cwd, maxPackages: 1 })[0];
};
