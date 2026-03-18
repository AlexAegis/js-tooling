/**
 * Source: https://twitter.com/dfidalgo_/status/1751434860168671393
 */

type _NumbersBefore<N extends number, A extends number[] = []> = A['length'] extends N
	? A[number]
	: _NumbersBefore<N, [...A, A['length']]>;

/**
 * type To100 = NumbersBefore<101>;
 */
export type NumbersBefore<N extends number> = _NumbersBefore<N>;

/**
 * type From50To100 = NumbersInRange<50, 101>;
 */
export type NumbersInRange<A extends number, B extends number> = Exclude<
	NumbersBefore<B>,
	NumbersBefore<A>
>;
