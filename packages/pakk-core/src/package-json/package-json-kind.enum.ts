/**
 * These are the kinds of packageJson files we distinguish. The on you interact
 * with during DEVELOPMENT is the source packageJson file, and will be
 * transformed prior to DISTRIBUTION.
 */
export const PACKAGE_JSON_KIND = {
	/**
	 * Used in the repository as the source packageJson
	 */
	DEVELOPMENT: 'development',
	/**
	 * The packageJson that will be in the distributed package
	 */
	DISTRIBUTION: 'distribution',
} as const;

/**
 * @deprecated use common
 */
export type ValuesOf<T> = T[keyof T];

export type PackageJsonKindType = ValuesOf<typeof PACKAGE_JSON_KIND>;

export const isPackageJsonKindType = (s: string): s is PackageJsonKindType => {
	return Object.values(PACKAGE_JSON_KIND).includes(s as PackageJsonKindType);
};
