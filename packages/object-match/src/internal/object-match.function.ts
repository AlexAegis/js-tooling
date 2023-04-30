export type LeafValue = string | number | undefined | null;

export interface JsonObject {
	[key: string | number]: JsonObject | LeafValue | (JsonObject | LeafValue)[];
}

export type JsonValue = JsonObject[keyof JsonObject];

export const isJsonObject = (t: unknown): t is JsonObject => {
	return typeof t === 'string' || typeof t === 'number' || typeof t === 'object';
};

export type CustomMatcher = (value: JsonValue) => boolean;

export type LeafMatcher = string | number | RegExp | CustomMatcher;

export interface ObjectMatcher {
	[key: string | number]: ObjectMatcher | LeafMatcher | (ObjectMatcher | LeafMatcher)[];
}

export type JsonMatcher = ObjectMatcher[keyof ObjectMatcher];

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
