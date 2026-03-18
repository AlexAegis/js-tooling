import type { Awaitable } from '../objects/awaitable.type.js';

export const asyncMap = async <T, R>(
	array: T[],
	map: (t: T, i: number) => Awaitable<R>,
): Promise<R[]> => {
	return Promise.all(array.map(map));
};
