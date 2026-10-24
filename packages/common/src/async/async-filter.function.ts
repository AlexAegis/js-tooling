import { isPromiseFulfilled } from './is-promise-fulfilled.function.js';

const filterMark = {};

const itemOrFilterMark = async <T>(item: T, check: Promise<boolean>) =>
	(await check) ? item : filterMark;

export const asyncFilter = async <T>(
	array: T[],
	predicate: (t: T, i: number) => Promise<boolean>,
): Promise<T[]> => {
	const checks = await Promise.allSettled(
		// predicate() runs outside the async helper, so a synchronous throw still rejects asyncFilter
		array.map((item, i) => itemOrFilterMark(item, predicate(item, i))),
	);

	return checks
		.filter(isPromiseFulfilled)
		.map((item) => item.value)
		.filter((result): result is Awaited<T> => result !== filterMark);
};
