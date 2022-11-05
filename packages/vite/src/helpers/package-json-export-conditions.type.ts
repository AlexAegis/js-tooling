/**
 * https://nodejs.org/api/packages.html#exports
 * There are some community conditions that are not indluded. Check here for
 * more: https://nodejs.org/api/packages.html#community-conditions-definitions
 */
export type PackageJsonExportConditions = Record<string, string> & {
	/**
	 * Community condition.
	 * Can be used by typing systems to resolve the typing file for the given export.
	 * ! This condition should always be included first.
	 */
	types?: string;
	/**
	 * Used by NodeJS
	 */
	default?: string;
	/**
	 * Used by NodeJS
	 */
	import?: string;
	/**
	 * Used by NodeJS
	 */
	node?: string | { import?: string; require?: string };
	/**
	 * Used by NodeJS
	 */
	require?: string;
	/**
	 * Used by Deno
	 */
	deno?: string;
};
