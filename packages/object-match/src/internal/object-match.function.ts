export type JsonLeafValue = string | number | undefined | null;

export interface JsonObject {
	[key: string | number]: JsonObject | JsonLeafValue | (JsonObject | JsonLeafValue)[];
}

export type JsonValue = JsonObject[keyof JsonObject];

export const isJsonObject = (t: unknown): t is JsonObject => {
	return typeof t === 'string' || typeof t === 'number' || typeof t === 'object';
};

export type CustomJsonValueMatcher<T extends JsonValue | JsonValue[] = JsonValue> = (
	value: T
) => boolean;

export type JsonLeafMatcher = string | number | RegExp | CustomJsonValueMatcher;

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
export type JsonMatcherFrom<T> = {
	[K in keyof T]: T[K] extends string
		? string | RegExp | CustomJsonValueMatcher<string>
		: T[K] extends number
		? number | CustomJsonValueMatcher<number>
		: T[K] extends (infer R)[]
		?
				| (JsonObjectMatcher | JsonLeafMatcher)[]
				| CustomJsonValueMatcher<R extends JsonValue ? R[] : (JsonObject | JsonLeafValue)[]>
		: T[K] extends JsonValue
		? JsonMatcherFrom<T[K]> | CustomJsonValueMatcher<T[K]>
		: never;
};

/**
 * TODO: Options to set if extra keys are allowed or not, currently it's allowed
 */
export const objectMatch = (
	target: JsonValue,
	matcher: JsonMatcher | undefined | null
): boolean => {
	if (typeof matcher === 'string') {
		return typeof target === 'string' && new RegExp(matcher).test(target); // Treat every string filter as a RegExp
	} else if (matcher === undefined) {
		return target === undefined || target === null;
	} else if (matcher === null) {
		return target === null;
	} else if (typeof matcher === 'number') {
		return typeof target === 'number' && target === matcher;
	} else if (typeof matcher === 'function') {
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
				objectMatch(target[filterKey], filter)
			);
		});
	}
};
