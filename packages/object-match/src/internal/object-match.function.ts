export type JsonLeafValue = string | number | boolean | undefined | null;

export interface JsonObject {
	[key: string | number]: JsonObject | JsonLeafValue | (JsonObject | JsonLeafValue)[];
}
export type JsonValue = JsonObject[keyof JsonObject];

export const isJsonObject = (t: unknown): t is JsonObject => {
	return typeof t === 'string' || typeof t === 'number' || typeof t === 'object';
};

export const isCustomJsonValueMatcher = <T>(t: unknown): t is CustomJsonValueMatcher<T> => {
	return typeof t === 'function';
};

export type CustomJsonValueMatcher<T = JsonValue> = (value: T) => boolean;

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
export type JsonMatcherFrom<T> = T extends string
	? string | RegExp | CustomJsonValueMatcher<string>
	: T extends number
	? number | CustomJsonValueMatcher<number>
	: T extends (infer R)[]
	? JsonMatcherFrom<R>[] | CustomJsonValueMatcher<T>
	: T extends object
	?
			| {
					[K in keyof T]?: JsonMatcherFrom<T[K]>;
			  }
			| CustomJsonValueMatcher<T>
	: T;

/**
 * TODO: Options to set if extra keys are allowed or not, currently it's allowed
 * TODO: The generic was extremely slow!!!
 */
export const objectMatch = <T = JsonValue>(
	target: T,
	matcher: JsonMatcher | undefined | null
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
		return matcher(target);
	} else if (matcher instanceof RegExp) {
		return typeof target === 'string' && matcher.test(target);
	} else if (Array.isArray(matcher)) {
		return Array.isArray(target)
			? matcher.every((itemMatcher, i) => objectMatch(target[i], itemMatcher))
			: false;
	} else {
		return Object.entries(matcher).every(([filterKey, filter]) => {
			return (
				typeof target === 'object' &&
				target !== null && // typeof null === 'object'
				!Array.isArray(target) &&
				objectMatch(
					(target as Record<string | number, unknown>)[filterKey],
					filter as JsonMatcher
				)
			);
		});
	}
};
