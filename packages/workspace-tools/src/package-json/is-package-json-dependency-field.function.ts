import { PACKAGE_JSON_DEPENDENCY_FIELDS } from './package-json.interface.js';

export type PackageJsonDependencyField = (typeof PACKAGE_JSON_DEPENDENCY_FIELDS)[number];

/**
 * Returns true for 'dependencies', 'devDependencies',
 * 'optionalDependencies' and 'peerDependencies'
 */
export const isPackageJsonDependencyField = (
	field: unknown,
): field is PackageJsonDependencyField => {
	return PACKAGE_JSON_DEPENDENCY_FIELDS.includes(field as PackageJsonDependencyField);
};
