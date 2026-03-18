import { describe, expect, it } from 'vitest';
import { normalizeRegExpLikeToRegExp } from './normalize-regexplike-into-regexp.function.js';

describe('normalizeRegExpLikeToRegExp', () => {
	it('should return a regex as is', () => {
		const regexLike = /foo/;
		const normalized = normalizeRegExpLikeToRegExp(regexLike);
		expect(normalized).toBe(regexLike);
	});

	it('should return a string as a regex', () => {
		const regexLike = 'foo.*';
		const normalized = normalizeRegExpLikeToRegExp(regexLike);
		expect(typeof normalized).toEqual('object');
		expect(normalized.source).toEqual(regexLike);
	});
});
