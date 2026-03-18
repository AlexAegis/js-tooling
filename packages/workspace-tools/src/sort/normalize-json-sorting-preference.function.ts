import type { ObjectKeyOrder } from '@alexaegis/common';
import { normalizeCwdOption, readJson, type CwdOption } from '@alexaegis/fs';
import { join } from 'node:path';

import { getWorkspaceRoot } from '../npm/get-workspace-root.function.js';
import { PACKAGE_JSON_NAME } from '../package-json/package-json.interface.js';
import { DEFAULT_PACKAGE_JSON_SORTING_PREFERENCE } from './default-package-json-order.const.js';
import { normalizeSortingPreferenceForPackageJson } from './normalize-sorting-preference-for-package-json.function.js';

export interface SortingPreferenceJson {
	schema?: string;
	sort: ObjectKeyOrder;
}

/**
 * Creates a function that can receive an optional objectKeyOrder and return it.
 * It will also try to load a file from .config/${filename}.sort.json
 * and treat it as the sorting preference if no custom preference is passed.
 * That's why this function is async, but the normalizer itself is not.
 *
 * If the fileName passed is package.json it will also perform some adjustments
 * to any order received to make sure the exports object will be valid.
 *
 * For package.json's only, when there's no keyorder is passed and there's no
 * .config/package.sort.json is present, an opinionated order is returned
 * specifically for package.json files.
 *
 */
export const createJsonSortingPreferenceNormalizer = async (
	fileName: string,
	rawOptions?: CwdOption,
) => {
	const options = normalizeCwdOption(rawOptions);
	const workspaceRoot = getWorkspaceRoot(options);

	let workspaceSortPreference: SortingPreferenceJson | undefined;
	if (workspaceRoot) {
		workspaceSortPreference = await readJson<SortingPreferenceJson>(
			join(workspaceRoot, '.config', fileName.replace(/\.json$/, '.sort.json')),
		);
	}

	return (sortingPreference?: ObjectKeyOrder): ObjectKeyOrder => {
		let sortingOrder: ObjectKeyOrder | undefined =
			sortingPreference ?? workspaceSortPreference?.sort;

		if (fileName === PACKAGE_JSON_NAME) {
			if (sortingPreference) {
				sortingOrder = normalizeSortingPreferenceForPackageJson(sortingPreference);
			} else if (workspaceSortPreference?.sort) {
				sortingOrder = normalizeSortingPreferenceForPackageJson(
					workspaceSortPreference.sort,
				);
			} else {
				sortingOrder = normalizeSortingPreferenceForPackageJson(
					DEFAULT_PACKAGE_JSON_SORTING_PREFERENCE,
				);
			}
		}

		return sortingOrder ?? [];
	};
};
