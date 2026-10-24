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

// an assignment to a __proto__ key would replace the prototype instead
const setOwnProperty = (target: object, key: string, value: unknown): void => {
	Object.defineProperty(target, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: true,
	});
};

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
					// an inherited value, like Object.prototype.constructor, is shadowed, not merged into
					const mergedValue = Object.hasOwn(merged, key) ? merged[key] : undefined;
					if (mergedValue) {
						merged[key] = deepMergeInternal(
							[mergedValue as T, structuredClone(sourceValue)],
							options,
							visited,
						);
					} else {
						setOwnProperty(merged, key, structuredClone(sourceValue));
					}
				} else {
					setOwnProperty(merged, key, structuredClone(sourceValue));
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
 * Merges multiple objects in order into a copy of the first one.
 * Arrays are merged naively using === equality.
 *
 * A key that a later source sets to `undefined` is `undefined` in the result,
 * unless the `dropKeys` option drops it.
 */
export const deepMerge = <T extends unknown[]>(
	sources: [...T],
	options?: DeepMergeOptions,
): MergeTuple<T> => {
	return deepMergeInternal([...sources], options); // a copy, deepMergeInternal shifts it
};
