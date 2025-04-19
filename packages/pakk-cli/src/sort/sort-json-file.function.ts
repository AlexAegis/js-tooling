import { sortObject, type ObjectKeyOrder } from '@alexaegis/common';
import { readJson, writeJson } from '@alexaegis/fs';
import type { Logger } from '@alexaegis/logging';
import { normalizeSortingPreferenceForPackageJson } from '@alexaegis/workspace-tools';
import p from 'node:path';

/**
 * Reads a json file, sorts it based on a sorting config then writes it back,
 * if available also formats it with prettier. If the file is named
 * `package.json` it may override some rules to always produce a functional
 * result.
 *
 * @param path
 *
 * @return was sorted or not
 */
export const sortJsonFile = async (
	path: string,
	options: SortJsonFileOptions,
): Promise<boolean> => {
	const content = await readJson<Record<string, unknown>>(path);
	if (content) {
		let sortPreferences = options.sortingPreference;

		if (p.basename(path) === 'package.json') {
			sortPreferences = normalizeSortingPreferenceForPackageJson(sortPreferences);
		}

		const sortedContent = sortObject(content, sortPreferences);

		const alreadySorted = JSON.stringify(content) === JSON.stringify(sortedContent);

		if (!options.dry && !options.check) {
			await writeJson(sortedContent, path, options);
		} else if (options.dry && !options.check) {
			options.logger?.info(`sorting ${path}`);
		} else if (options.check && !alreadySorted) {
			options.logger?.info(`not sorted: ${path}`);
		}

		return alreadySorted;
	} else {
		return false;
	}
};

export interface SortJsonFileOptions {
	sortingPreference: ObjectKeyOrder;
	/**
	 * @defaultValue true
	 */
	autoPrettier?: boolean;
	/**
	 * @defaultValue false
	 */
	dry?: boolean;
	/**
	 * If using check mode, it won't write, but won't log either
	 * @defaultValue false
	 */
	check?: boolean;

	logger?: Logger<unknown>;
}
