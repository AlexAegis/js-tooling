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
const normalizeExportsOrder = (
	sortingPrefrence: string | { key: string; order: ObjectKeyOrder },
	targetKey: string,
): string | { key: string; order: ObjectKeyOrder } => {
	if (typeof sortingPrefrence === 'string' && sortingPrefrence === targetKey) {
		return {
			key: targetKey,
			order: [{ key: '.*', order: ['types', '.*', 'default'] }],
		};
	}
	return typeof sortingPrefrence === 'object' && sortingPrefrence.key === targetKey
		? normalizeExportsDetailedEntry(sortingPrefrence, targetKey)
		: sortingPrefrence;
};

const normalizeExportsDetailedEntry = (
	entry: { key: string; order: ObjectKeyOrder },
	targetKey: string,
): { key: string; order: ObjectKeyOrder } => {
	const order = entry.order.map((ordering) => {
		if (typeof ordering === 'string') {
			return { key: ordering, order: ['types', '.*', 'default'] as ObjectKeyOrder };
		}
		const typesEntry = ordering.order.find(
			(o) => (typeof o === 'string' ? o : o.key) === 'types',
		);
		const defaultEntry = ordering.order.find(
			(o) => (typeof o === 'string' ? o : o.key) === 'default',
		);

		const hasSpread = ordering.order.some((o) => (typeof o === 'string' ? o : o.key) === '.*');
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
			order: [typesEntry ?? 'types', ...nonSpecialEntries, defaultEntry ?? 'default'],
		};
	});

	if (order.every((o) => !(typeof o === 'object' && o.key === '.*'))) {
		order.push({ key: '.*', order: ['types', '.*', 'default'] as ObjectKeyOrder });
	}

	return { key: targetKey, order };
};

const normalizePublishConfigOrder = (
	sortingPrefrence: string | { key: string; order: ObjectKeyOrder },
): string | { key: string; order: ObjectKeyOrder } => {
	if (typeof sortingPrefrence === 'string' && sortingPrefrence === 'publishConfig') {
		return {
			key: 'publishConfig',
			order: [
				'access',
				{ key: 'exports', order: [{ key: '.*', order: ['types', '.*', 'default'] }] },
				'.*',
			],
		};
	}
	if (typeof sortingPrefrence === 'object' && sortingPrefrence.key === 'publishConfig') {
		return {
			key: 'publishConfig',
			order: sortingPrefrence.order.map((inner) => normalizeExportsOrder(inner, 'exports')),
		};
	}
	return sortingPrefrence;
};

export const normalizeSortingPreferenceForPackageJson = (
	sortingPreferences: ObjectKeyOrder,
): ObjectKeyOrder => {
	return sortingPreferences.some(
		(sortingPrefrence) =>
			(typeof sortingPrefrence === 'string' && sortingPrefrence === 'exports') ||
			(typeof sortingPrefrence === 'object' && sortingPrefrence.key === 'exports'),
	)
		? sortingPreferences.map((sortingPrefrence) => {
				const normalized = normalizePublishConfigOrder(sortingPrefrence);
				if (normalized !== sortingPrefrence) return normalized;

				if (typeof sortingPrefrence === 'string' && sortingPrefrence === 'exports') {
					return {
						key: 'exports',
						order: [{ key: '.*', order: ['types', '.*', 'default'] }],
					};
				}
				if (typeof sortingPrefrence === 'object' && sortingPrefrence.key === 'exports') {
					const order = sortingPrefrence.order.map((ordering) => {
						if (typeof ordering === 'string') {
							return { key: ordering, order: ['types', '.*', 'default'] };
						}
						// These special entries may be defined by the user as an object so let's keep it
						const typesEntry = ordering.order.find(
							(o) => (typeof o === 'string' ? o : o.key) === 'types',
						);
						const defaultEntry = ordering.order.find(
							(o) => (typeof o === 'string' ? o : o.key) === 'default',
						);

						const hasSpread = ordering.order.some(
							(o) => (typeof o === 'string' ? o : o.key) === '.*',
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
					});

					if (order.every((o) => o.key !== '.*')) {
						order.push({ key: '.*', order: ['types', '.*', 'default'] });
					}

					return {
						key: 'exports',
						order,
					};
				}
				return sortingPrefrence;
			})
		: [
				...sortingPreferences.map((p) => normalizePublishConfigOrder(p)),
				{
					key: 'exports',
					order: [{ key: '.*', order: ['types', '.*', 'default'] }],
				},
			];
};
