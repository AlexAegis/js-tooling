import { isObject } from './is-object.function.js';

export type DropKeyMatcher = (value: unknown, key: string | number | symbol) => boolean;

export const defaultDropKeyMatcher: DropKeyMatcher = (
	value: unknown,
	_key: string | number | symbol,
): value is undefined => value === undefined;

/**
 * Drops all keys that resolve to true using a matcher.
 * By default it drops keys set as undefined
 *
 * Mutates the object! Use `structuredClone` before if you don't want that.
 */
export const dropKeys = <T>(t: T, matcher: DropKeyMatcher = defaultDropKeyMatcher): T => {
	for (const key in t) {
		if (matcher(t[key], key)) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete t[key];
		}

		if (isObject(t[key])) {
			dropKeys(t[key], matcher);
		}
	}

	return t;
};
