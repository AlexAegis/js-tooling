import { collectPackageJsonLocationsLinearly } from './collect-package-json-locations-linearly.function.js';

/**
 *
 * @param cwd process.cwd()
 * @returns
 */
export const getWorkspaceRoot = (cwd: string = process.cwd()): string | undefined => {
	return collectPackageJsonLocationsLinearly(cwd)[0];
};
