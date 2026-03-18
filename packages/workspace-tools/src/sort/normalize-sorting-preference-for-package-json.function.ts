import type { ObjectKeyOrder } from '@alexaegis/common';

/**
 * The types field in the exports object has to be the first one. This
 * sortingPreference normalizer ensures that.
 *
 * It's also recommended to have the 'default' key be the last. This is also
 * ensured here.
 *
 * @returns a sortingPreference that will always be suited for packageJson files
 */
export const normalizeSortingPreferenceForPackageJson = (
	sortingPreferences: ObjectKeyOrder,
): ObjectKeyOrder => {
	return sortingPreferences.some(
		(sortingPrefrence) =>
			(typeof sortingPrefrence === 'string' && sortingPrefrence === 'exports') ||
			(typeof sortingPrefrence === 'object' && sortingPrefrence.key === 'exports'),
	)
		? sortingPreferences.map((sortingPrefrence) => {
				if (typeof sortingPrefrence === 'string' && sortingPrefrence === 'exports') {
					return {
						key: 'exports',
						order: [{ key: '.*', order: ['types', '.*', 'default'] }],
					};
				} else if (
					typeof sortingPrefrence === 'object' &&
					sortingPrefrence.key === 'exports'
				) {
					const order = sortingPrefrence.order.map((ordering) => {
						if (typeof ordering === 'string') {
							return { key: ordering, order: ['types', '.*', 'default'] };
						} else {
							// These special entries may be defined by the user as an object so let's keep it
							const typesEntry = ordering.order.find((o) =>
								typeof o === 'string' ? o === 'types' : o.key === 'types',
							);
							const defaultEntry = ordering.order.find((o) =>
								typeof o === 'string' ? o === 'default' : o.key === 'default',
							);

							const hasSpread = ordering.order.some((o) =>
								typeof o === 'string' ? o === '.*' : o.key === '.*',
							);
							const nonSpecialEntries = ordering.order.filter((o) =>
								typeof o === 'string'
									? o !== 'types' && o !== 'default'
									: o.key !== 'types' && o.key !== 'default',
							);

							if (!hasSpread) {
								nonSpecialEntries.push('.*');
							}

							return {
								key: ordering.key,
								order: [
									typesEntry ?? 'types',
									...nonSpecialEntries,
									defaultEntry ?? 'default',
								],
							};
						}
					});

					if (!order.some((o) => o.key === '.*')) {
						order.push({ key: '.*', order: ['types', '.*', 'default'] });
					}

					return {
						key: 'exports',
						order,
					};
				} else {
					return sortingPrefrence;
				}
			})
		: [
				...sortingPreferences,
				{
					key: 'exports',
					order: [{ key: '.*', order: ['types', '.*', 'default'] }],
				},
			];
};
