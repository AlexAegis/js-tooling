import type { Fn } from './fn.type.js';
import { normalizeMemoizeOptions, type MemoizeOptions } from './memoize.function.options.js';

/**
 * By default the cache does not start growing, the limit is infinite.
 * To set otherwise, use the options object.
 *
 * @param fn to be memoized
 * @param rawOptions options to customize cache behavior
 * @returns the memoized version of the function that will either return a cached value
 * or call the original function when one does not exist.
 */
export const memoize = <F extends (...args: never) => unknown, T = unknown>(
	fn: F,
	rawOptions?: MemoizeOptions<F, T>,
): Fn<Parameters<F>, ReturnType<F>> => {
	const options = normalizeMemoizeOptions(rawOptions);
	const dropQueue: string[] = [];

	return (...args: Parameters<F>): ReturnType<F> => {
		const hash = options.argHasher(args);
		// Checking for the existence of a key instead of just using get
		// and checking if it's nullish or not, to avoid preventing nullish
		// results from being cached.
		if (options.cache.has(hash)) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return options.cache.get(hash)!;
		} else {
			const result = fn.apply(options.thisContext, args as never) as ReturnType<F>;
			options.cache.set(hash, result);

			if (options.maxCacheEntries > 0 && options.maxCacheEntries < Number.POSITIVE_INFINITY) {
				dropQueue.push(hash);
				if (dropQueue.length > options.maxCacheEntries) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const cacheToDrop = dropQueue.shift()!;
					options.cache.delete(cacheToDrop);
				}
			}

			return result;
		}
	};
};
