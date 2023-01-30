/**
 *
 * @deprecated use core
 */
export const isNonNullable = <T>(o: T | undefined | null): o is NonNullable<T> =>
	o !== undefined && o !== null;

/**
 *
 * @deprecated use core
 */
export const isNullish = <T>(o: T | undefined | null): o is undefined | null =>
	o === undefined || o === null;
