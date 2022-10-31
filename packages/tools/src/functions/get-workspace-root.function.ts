import { collectPackageJsonLocationsLinearly } from './collect-package-json-locations-linearly.function.js';

export const getWorkspaceRoot = (path: string): string | undefined => {
	return collectPackageJsonLocationsLinearly(path)[0];
};
