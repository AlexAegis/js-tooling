/**
 * Getting a proper specificity measure is a hard problem, this is but a very
 * simple solution, that is good-enough for this usecase.
 * It's just counting how many of the matched words letters are actually in
 * the regex.
 *
 * For RegExp's pass in the `.source`
 */
export const measureRegExpSpecificity = (r: string, v: string): number => {
	return [...v].filter((c) => r.includes(c)).length;
};
