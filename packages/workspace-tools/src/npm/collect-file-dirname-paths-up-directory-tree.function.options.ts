import type { Defined } from '@alexaegis/common';
import {
	normalizeCwdOption,
	normalizeDirectoryDepthOption,
	type CwdOption,
	type DirectoryDepthOption,
} from '@alexaegis/fs';

export type CollectFileDirnamesUpDirectoryTreeOptions = CwdOption &
	DirectoryDepthOption & {
		/**
		 * How many packages it should search in at most (A folder is treated
		 * as a package if there is a `package.json` file directly in it)
		 *
		 * Normally workspaces only have 2 layer of packages, so by default
		 * I assume a monorepo. You can change this to 1 if using a
		 * single-project repo, or to something larger like `Infinity` if you
		 * have something more unique. For example searching from inside the
		 * node_modules folder will definitely need you to find more than
		 * 2 package.json files. But normally your `cwd` won't be inside there.
		 *
		 * @default 2
		 */
		maxPackages?: number | undefined;

		/**
		 * If the search term is package.json, this has the same effect
		 * as maxPackages. Both conditions can stop the search, the smaller one
		 * will be the stronger.
		 *
		 * @default Infinity
		 */
		maxResults?: number | undefined;
	};

export type NormalizedCollectFileDirnamesUpDirectoryTreeOptions =
	Defined<CollectFileDirnamesUpDirectoryTreeOptions>;

export const normalizeCollectFileDirnamesUpDirectoryTreeOptions = (
	options?: CollectFileDirnamesUpDirectoryTreeOptions,
): NormalizedCollectFileDirnamesUpDirectoryTreeOptions => {
	return {
		...normalizeCwdOption(options),
		...normalizeDirectoryDepthOption(options),
		maxPackages: options?.maxPackages ?? 2,
		maxResults: options?.maxResults ?? Number.POSITIVE_INFINITY,
	};
};
