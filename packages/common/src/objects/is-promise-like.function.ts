import { isNotNullish } from './is-not-nullish.function.js';

export const isPromiseLike = <T>(candidate: unknown): candidate is PromiseLike<T> => {
	return (
		isNotNullish(candidate) &&
		typeof candidate === 'object' &&
		typeof (candidate as Record<string, unknown>)['then'] === 'function' &&
		typeof (candidate as Record<string, unknown>)['catch'] === 'function'
	);
};
