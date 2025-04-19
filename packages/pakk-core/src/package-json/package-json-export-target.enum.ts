/**
 * These are the kinds of paths the entries in a packageJson's exports object
 * can point to.
 *
 * It is only used for the development/source packageJson. The distributed
 * packageJson will only have paths that refer to itself.
 */
export enum PackageJsonExportTarget {
	/**
	 * This targets the source files.
	 *
	 * For example the `development` packageJson targets the local entry points
	 * for types
	 */
	SOURCE = 'source',
	/**
	 * This targets the directory where compiled files end up in. Wherever
	 * `outDir` points to.
	 *
	 * For example both the `development` and `distribution` packageJson files
	 * target this for the actual imports.
	 */
	DIST = 'dist',
	/**
	 * The shim folder is used for local bins
	 *
	 * For example the `development` packageJson files bin entries target the
	 * shim directory. So pnpm can link them event before the package is built.
	 */
	SHIM = 'shim',
}

export type PathMap<T extends string> = Record<string, Record<T, string>>;
