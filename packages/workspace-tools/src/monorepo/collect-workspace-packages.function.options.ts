import { normalizeRegExpLikeToRegExp, type Defined } from '@alexaegis/common';
import type { JsonMatcherFrom } from '@alexaegis/match';
import type { PackageJson } from '../index.js';
import {
	normalizeGetRootPackageJsonOptions,
	type GetRootPackageJsonOptions,
	type NormalizedGetRootPackageJsonOptions,
} from '../npm/get-root-package-json.function.options.js';

interface CollectWorkspaceOnlyOptions {
	/**
	 * Only return the root workspace package
	 *
	 * @defaultValue false
	 */
	onlyWorkspaceRoot?: boolean;

	/**
	 * Skip the root workspace package itself. Has no effect if the repo is
	 * not a monorepo!
	 *
	 * @defaultValue false
	 */
	skipWorkspaceRoot?: boolean;

	/**
	 * When defined only the packages where the package.json file is matching
	 * to this matcher are returned.
	 */
	packageJsonMatcher?: JsonMatcherFrom<PackageJson> | undefined;

	/**
	 * Return only those packages that list these dependencies among either
	 * `dependencies` or `devDependencies`. When it's not
	 * defined or is an empty array, it will not perform such filtering.
	 *
	 * Note that while the `packageJsonMatcher` can also match dependencies,
	 * matching across multiple fields at the top level means that you're
	 * limited to only use a single function based matcher, or writing
	 * needlessly complicated boilerplate. So this field is here to trivialize
	 * this usecase.
	 *
	 * @defaultValue []
	 */
	dependencyCriteria?: (string | RegExp)[];
}

export type CollectWorkspacePackagesOptions = CollectWorkspaceOnlyOptions &
	GetRootPackageJsonOptions;

export type NormalizedCollectWorkspacePackagesOptions = Defined<
	Omit<CollectWorkspaceOnlyOptions, 'dependencyCriteria' | 'packageJsonMatcher'>
> & {
	dependencyCriteria: RegExp[];
} & Pick<CollectWorkspaceOnlyOptions, 'packageJsonMatcher'> &
	NormalizedGetRootPackageJsonOptions;

export const normalizeCollectWorkspacePackagesOptions = (
	options?: CollectWorkspacePackagesOptions,
): NormalizedCollectWorkspacePackagesOptions => {
	return {
		...normalizeGetRootPackageJsonOptions(options),
		onlyWorkspaceRoot: options?.onlyWorkspaceRoot ?? false,
		skipWorkspaceRoot: options?.skipWorkspaceRoot ?? false,
		dependencyCriteria: options?.dependencyCriteria?.map(normalizeRegExpLikeToRegExp) ?? [],
		packageJsonMatcher: options?.packageJsonMatcher,
	};
};
