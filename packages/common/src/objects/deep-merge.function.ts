import { defaultDropKeyMatcher, dropKeys, type DropKeyMatcher } from './drop-keys.function.js';
import { isObject } from './is-object.function.js';
import type { MergeTuple } from './tuple.type.js';

export interface DeepMergeOptions {
	/**
	 * When set to true, if any of the sources set something to undefined
	 * @default false
	 */
	preferUndefined?: boolean;

	/**
	 * Wether or not to drop undefineds from the resulting merge before return
	 * When set to true it will drop keys that are set to undefined.
	 * When set to a matcher function it will drop only those keys.
	 *
	 * To use this functionally elsewhere see the
	 * [`dropKeys`](./drop-keys.function.ts) function.
	 *
	 * This will happen at the last step
	 *
	 * @default false
	 */
	dropKeys?: boolean | DropKeyMatcher;
}

const deepMergeInternal = <T extends unknown[]>(
	sources: [...T],
	options?: DeepMergeOptions,
	visited = new Set<unknown>(),
): MergeTuple<T> => {
	const firstSource = sources.shift();
	visited.add(firstSource);
	const merged: unknown = structuredClone(firstSource);

	for (const source of sources) {
		visited.add(source);

		if (Array.isArray(source) && Array.isArray(merged)) {
			for (const element of source) {
				if (!merged.includes(element)) {
					merged.push(element);
				}
			}
		} else if (isObject(source) && isObject(merged)) {
			for (const key in source) {
				const sourceValue = source[key];

				if (
					Object.hasOwn(merged, key) &&
					merged[key] === undefined &&
					options?.preferUndefined
				) {
					continue;
				}

				if (isObject(sourceValue)) {
					if (merged[key]) {
						merged[key] = deepMergeInternal(
							[merged[key] as T, structuredClone(sourceValue)],
							options,
							visited,
						);
					} else {
						Object.assign(merged, { [key]: structuredClone(sourceValue) });
					}
				} else {
					Object.assign(merged, { [key]: structuredClone(sourceValue) });
				}
			}
		}
	}

	if (options?.dropKeys) {
		const matcher =
			typeof options.dropKeys === 'function' ? options.dropKeys : defaultDropKeyMatcher;
		dropKeys(merged, matcher);
	}

	return merged as MergeTuple<T>;
};

/**
 * Merges multiple objects in order into the first argument.
 * It mutates the target! Arrays are merged naively using === equality.
 *
 * Keys that are explicitly set to `undefined` among sources are dropped from
 * the target object.
 */
export const deepMerge = <T extends unknown[]>(
	sources: [...T],
	options?: DeepMergeOptions,
): MergeTuple<T> => {
	return deepMergeInternal(sources, options);
};
