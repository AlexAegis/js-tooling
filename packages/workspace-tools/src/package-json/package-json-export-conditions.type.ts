/**
 * https://nodejs.org/api/packages.html#exports
 * There are some community conditions that are not indluded. Check here for
 * more: https://nodejs.org/api/packages.html#community-conditions-definitions
 */
export type PackageJsonExportConditions = Record<string, string> & {
	/**
	 * Community condition.
	 * Can be used by typing systems to resolve the typing file for the given export.
	 * ! This condition must always be included first.
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
	 *
	 * This can also be an object like `{ import?: string; require?: string }`
	 * But I'm not using it so I keep it simple
	 */
	node?: string;
	/**
	 * Used by NodeJS
	 */
	require?: string;
	/**
	 * Used by Deno
	 */
	deno?: string;
};
