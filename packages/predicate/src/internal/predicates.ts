export type Predicate<T> = (value?: T | null) => boolean;

export const not = <T>(predicate: Predicate<T>): Predicate<T> => {
	return (value?: T | null): boolean => !predicate(value);
};

export const equal = <T>(criteria: T) => {
	return (value?: T | null): value is T => value === criteria;
};

export const and = <T>(...predicates: Predicate<T>[]): Predicate<T> => {
	return (value?: T | null): boolean => predicates.every((predicate) => predicate(value));
};

export const or = <T>(...predicates: Predicate<T>[]): Predicate<T> => {
	return (value?: T | null): boolean => predicates.some((predicate) => predicate(value));
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- removing T would break callers that pass a type argument
export const contains = <T extends string>(criteria: T): Predicate<string> => {
	return (value?: T | string | null): value is string => value?.includes(criteria) ?? false;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- removing T would break callers that pass a type argument
export const matchRegExp = <T extends string>(criteria: RegExp): Predicate<string> => {
	return (value?: T | string | null): value is string =>
		typeof value === 'string' && criteria.test(value);
};

export const predicate = {
	not,
	equal,
	and,
	or,
	contains,
	matchRegExp,
} as const;
