/**
 * groups an array of elements into multiple arrays on an object where the
 * key is the string returned by the groupKey function.
 *
 * If the groupKey function returns undefined, the value won't be included
 * in the result. This can be used to filter out values from the initial array.
 *
 * There's also an ECMAScript proposal that will add a very similar function
 * on Object and Array: https://github.com/tc39/proposal-array-grouping
 *
 * This function can be deprecated once it's widely released.
 */
export const groupBy = <T, K extends string>(
	elements: T[],
	groupKey: (element: T) => K | undefined,
): Record<K, T[]> => {
	return elements.reduce<Record<string, T[]>>((acc, next) => {
		const key = groupKey(next);
		if (key) {
			let group: T[] | undefined = acc[key];
			if (group) {
				group.push(next);
			} else {
				const newGroup: T[] = [next];
				group = newGroup;
				acc[key] = newGroup;
			}
		}
		return acc;
	}, {});
};
