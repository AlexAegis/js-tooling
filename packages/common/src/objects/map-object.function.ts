import type { SimpleObjectKey } from './struct.type.js';

export const mapObject = <T extends Record<SimpleObjectKey, unknown>, K>(
	o: T,
	map: (value: T[keyof T], key: keyof T) => K,
): Record<keyof T, K> => {
	return Object.fromEntries(
		Object.entries(o).map(([key, value]) => {
			return [key, map(value as T[keyof T], key)];
		}),
	) as Record<keyof T, K>;
};
