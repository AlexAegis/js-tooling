import type { Defined, ObjectKeyOrder } from '@alexaegis/common';
import { normalizeCwdOption, type CwdOption } from '@alexaegis/fs';

export interface AutoSortPackageJsonOptions extends CwdOption {
	/**
	 * ### AutoSortPackageJson
	 *
	 * Define an order of keys that will be applied to the target object
	 * The rest of the keys will be ordered in alphabetical order.
	 * You can nest ordering by adding an object, that defines a sub-ordering.
	 *
	 * ! All ordering keys are treated as regular expressions, make sure they
	 * ! are valid!
	 *
	 * To keep your package.json valid some order rules may be overwritten,
	 * like making sure 'types' is always the first entry in 'exports' objects
	 *
	 * By default it orders everything in alphabetical order.
	 *
	 * @example ['name', '.*', { key: 'scripts', order: ['start', 'build.*'] }, '.*']
	 * @defaultValue []
	 */
	sortingPreference?: ObjectKeyOrder | undefined;
}

export type NormalizedAutoSortPackageJsonOptions = Defined<CwdOption> & AutoSortPackageJsonOptions;

export const normalizeAutoSortPackageJsonOptions = (
	options?: AutoSortPackageJsonOptions,
): NormalizedAutoSortPackageJsonOptions => {
	return {
		...normalizeCwdOption(options),
		sortingPreference: options?.sortingPreference,
	};
};
