import { isNotNullish } from '../index.js';
import { isPromiseFulfilled } from './is-promise-fulfilled.function.js';

export const asyncFilterMap = async <T, R>(
	array: T[],
	map: (t: T, i: number) => Promise<R | undefined>,
): Promise<R[]> => {
	const checks = await Promise.allSettled(array.map(map));

	return checks
		.filter(isPromiseFulfilled)
		.map((item) => item.value)
		.filter(isNotNullish);
};
