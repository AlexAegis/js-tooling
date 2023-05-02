/**
 * Applies a map function to every value of a record while keeping all the
 * keys
 * TODO: move this to js-core
 *
 */
export const mapRecord = <From, To, Key extends string | number | symbol>(
	record: Record<Key, From>,
	mapFn: (item: From, key: Key) => To
): Record<Key, To> => {
	return Object.fromEntries(
		Object.entries<From>(record).map(([key, item]) => [key, mapFn(item, key as Key)])
	) as Record<Key, To>;
};
