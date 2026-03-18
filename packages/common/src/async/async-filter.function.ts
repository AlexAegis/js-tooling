import { isPromiseFulfilled } from './is-promise-fulfilled.function.js';

const filterMark = {};

export const asyncFilter = async <T>(
	array: T[],
	predicate: (t: T, i: number) => Promise<boolean>,
): Promise<T[]> => {
	const checks = await Promise.allSettled(
		array.map((item, i) => {
			return predicate(item, i).then((result) => (result ? item : filterMark));
		}),
	);

	return checks
		.filter(isPromiseFulfilled)
		.map((item) => item.value)
		.filter((result): result is Awaited<T> => result !== filterMark);
};
