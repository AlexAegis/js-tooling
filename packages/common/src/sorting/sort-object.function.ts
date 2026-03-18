import { isNotNullish } from '../objects/is-not-nullish.function.js';
import type { SimpleObjectKey } from '../objects/struct.type.js';
import type { DetailedObjectKeyOrder, ObjectKeyOrder } from './object-key-order.type.js';
import { measureRegExpSpecificity } from './regex-specificity.function.js';

const arrayToObject = <T extends SimpleObjectKey>(a: T[]): Record<SimpleObjectKey, T> => {
	return a.reduce<Record<SimpleObjectKey, T>>((acc, next) => {
		acc[next] = next;
		return acc;
	}, {});
};

const regexpSorterOne = (a: RegExp, b: RegExp): number =>
	a.test(b.source) || b.test(a.source) ? -1 : a.source.localeCompare(b.source);

/**
 *
 * Among multiple @param matchers like ['.*', 'b', '.*'], when trying to fit in
 * a @param key, which slot would maintain order the best? For example fitting
 * 'a' into the above matcher order, it should go to the left slot, but fitting
 * 'c' should make it go to the right slot.
 */
export const findMostSensibleMatch = (matchers: RegExp[], key: string): number => {
	// find all matchers, for afterEach, replace the matcher with the key. rank them which is better by sorting them and measure how much it moved
	const matcherIndices = matchers
		.map((matcher, i) => (matcher.test(key) ? i : undefined))
		.filter(isNotNullish);

	const deviations = matcherIndices.map((matcherIndice) => {
		const scenario = [...matchers];
		// It is definitely in it
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const originalMatcher = scenario[matcherIndice]!;
		const matcherSpecificity = measureRegExpSpecificity(originalMatcher.source, key);
		scenario[matcherIndice] = new RegExp(key);
		scenario.sort(regexpSorterOne);
		const scenarioSortIndex = scenario.findIndex((v) => v.source === key);
		const deviation = Math.abs(scenarioSortIndex - matcherIndice);

		return {
			deviation,
			originalMatcher,
			matcherIndice,
			matcherSpecificity,
		};
	});

	deviations.sort(
		(a, b) =>
			a.deviation === b.deviation
				? a.matcherSpecificity === b.matcherSpecificity
					? a.matcherIndice === b.matcherIndice
						? a.originalMatcher.source.localeCompare(b.originalMatcher.source)
						: b.matcherIndice - a.matcherIndice // the larger the better
					: b.matcherSpecificity - a.matcherSpecificity // The larger the better
				: a.deviation - b.deviation, // The smaller the better
	);

	return deviations[0]?.matcherIndice ?? -1;
};

export const findMostSensibleMatchIdeaTwo = (matchers: RegExp[], key: string): number => {
	// find all matchers, for afterEach, replace the matcher with the key. rank them which is better by sorting them and measure how much it moved
	const matchingIndices = matchers.map((matcher) =>
		matcher.test(key) ? new RegExp(key) : matcher,
	);

	const sortedMatchers = [...matchingIndices];
	sortedMatchers.sort(regexpSorterOne);
	// mnaybe this is a bad idea
	return -1;
};
/**
 * Creates a copy of an object with its keys ordered according to a
 * preferred ordering
 */
export const sortObject = <T extends object | unknown[]>(
	o: T,
	sortPreferences: ObjectKeyOrder = [],
): T => {
	const plainLevelOrder = sortPreferences.map((pref) =>
		typeof pref === 'object' ? pref.key : pref,
	);

	const regexpLevelOrder = plainLevelOrder.map((pref) => new RegExp(pref));
	// Turn arrays into objects too, they will be turned back into arrays
	const isArray = Array.isArray(o);
	let obj: T = o;
	if (isArray) {
		obj = arrayToObject(o) as T;
	}

	const ordered = Object.entries(obj)
		.map<[string, unknown, number]>(([key, value]) => {
			// Could fill multiple spots
			let order = Number.POSITIVE_INFINITY;

			const plainIndex = plainLevelOrder.indexOf(key);
			if (plainIndex >= 0) {
				// If it's directly there, use that
				order = plainIndex;
			} else {
				const regexpIndices = regexpLevelOrder
					.map((orderingRegExp, i) => (orderingRegExp.test(key) ? i : -1))
					.filter((index) => index > -1);

				// If not, let's find the closest match, the sorting order itself is sorted
				if (regexpIndices.length > 1) {
					order = findMostSensibleMatch(regexpLevelOrder, key);
				} else if (regexpIndices[0]) {
					order = regexpIndices[0];
				}
			}

			if (value !== undefined && value !== null && typeof value === 'object') {
				const subOrdering = sortPreferences
					.filter((pref): pref is DetailedObjectKeyOrder => typeof pref === 'object')
					.find((preference) => new RegExp(preference.key).test(key));
				return [key, sortObject(value, subOrdering?.order), order];
			} else {
				return [key, value, order];
			}
		})
		.sort(([ak, _av, aOrder], [bk, _bv, bOrder]) => {
			return aOrder >= 0 && bOrder >= 0 && aOrder !== bOrder
				? aOrder - bOrder
				: ak.localeCompare(bk);
		});

	return isArray ? (ordered.map((item) => item[1]) as T) : (Object.fromEntries(ordered) as T);
};
