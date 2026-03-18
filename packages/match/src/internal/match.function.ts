export type JsonLeafValue = string | number | boolean | undefined | null;

export interface JsonObject {
	[key: string | number]: JsonObject | JsonLeafValue | (JsonObject | JsonLeafValue)[];
}
export type JsonValue = JsonObject[keyof JsonObject];

/**
 * A simple predicate. Returing undefined is the same thing as false.
 */
export type CustomJsonValueMatcher<T = JsonValue> = (value: T) => boolean | undefined;

export type JsonLeafMatcher = string | number | boolean | RegExp | CustomJsonValueMatcher;

export interface JsonObjectMatcher {
	[key: string | number]:
		| JsonObjectMatcher
		| JsonLeafMatcher
		| (JsonObjectMatcher | JsonLeafMatcher)[];
}

export type JsonMatcher = JsonObjectMatcher[keyof JsonObjectMatcher];

/**
 * Turns a type into one that describes a valid matcher object for it.
 *
 * Beautiful.
 */
export type JsonMatcherFrom<T> =
	| CustomJsonValueMatcher<T>
	| (T extends string
			? T | RegExp
			: T extends object
				? {
						[K in keyof T]?: JsonMatcherFrom<T[K]>;
					}
				: T extends (infer R)[]
					? JsonMatcherFrom<R>[]
					: T);

const isCustomJsonValueMatcher = <T>(t: unknown): t is CustomJsonValueMatcher<T> => {
	return typeof t === 'function';
};

/**
 * TODO: Options to set if extra keys are allowed or not, currently it's allowed
 */
export const match = <T = JsonValue>(
	target: T,
	matcher: JsonMatcherFrom<T> | undefined | null,
): boolean => {
	if (typeof matcher === 'string') {
		return typeof target === 'string' && new RegExp(matcher).test(target); // Treat every string filter as a RegExp
	} else if (typeof matcher === 'number') {
		return typeof target === 'number' && target === matcher;
	} else if (typeof matcher === 'boolean') {
		return typeof target === 'boolean' && target === matcher;
	} else if (matcher === undefined) {
		return target === undefined || target === null;
	} else if (matcher === null) {
		return target === null;
	} else if (isCustomJsonValueMatcher<T>(matcher)) {
		return matcher(target) ?? false;
	} else if (matcher instanceof RegExp) {
		return typeof target === 'string' && matcher.test(target);
	} else if (Array.isArray(matcher)) {
		return Array.isArray(target)
			? matcher.every((itemMatcher, i) => match(target[i], itemMatcher))
			: false;
	} else {
		return Object.entries(matcher).every(([filterKey, filter]) => {
			return (
				typeof target === 'object' &&
				target !== null && // typeof null === 'object'
				!Array.isArray(target) &&
				match((target as Record<string | number, unknown>)[filterKey], filter)
			);
		});
	}
};
