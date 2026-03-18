import { describe, expect, it } from 'vitest';
import { and, contains, equal, matchRegExp, not, or } from './predicates.js';

describe('predicates', () => {
	describe('equal', () => {
		const assertion = equal('foo');

		it('should create a predicate that return true for equality', () => {
			expect(assertion('foo')).toBeTruthy();
		});

		it('should create a predicate that return false when it does not equal', () => {
			expect(assertion('bar')).toBeFalsy();
		});

		it('should return false when matching with undefined', () => {
			expect(assertion(undefined)).toBeFalsy();
		});
	});

	describe('contains', () => {
		const assertion = contains('f');

		it('should create a predicate that returns true when includes returns true', () => {
			expect(assertion('foo')).toBeTruthy();
		});

		it('should create a predicate that returns false when the value does not include the criteria', () => {
			expect(assertion('bar')).toBeFalsy();
		});

		it('should return false when matching with undefined', () => {
			expect(assertion(undefined)).toBeFalsy();
		});
	});

	describe('not', () => {
		const assertion = not(equal('foo'));

		it('should negate other operators, a matching equal should return false', () => {
			expect(assertion('foo')).toBeFalsy();
		});

		it('should negate other operators, a non matching equal should return true', () => {
			expect(assertion('bar')).toBeTruthy();
		});

		it('should return true when matching with undefined because it is negated', () => {
			expect(assertion(undefined)).toBeTruthy();
		});
	});

	describe('and', () => {
		const assertion = and(equal('foo'), contains('fo'));

		it('should and together other operators, return true only when all matches', () => {
			expect(assertion('foo')).toBeTruthy();
		});

		it('should and together other operators, return false only when any fails to match', () => {
			expect(assertion('bar')).toBeFalsy();
		});

		it('should return false when matching with undefined', () => {
			expect(assertion(undefined)).toBeFalsy();
		});
	});

	describe('or', () => {
		const assertion = or(equal('null'), contains('fo'));

		it('should or together other operators, return true when any matches', () => {
			expect(assertion('foo')).toBeTruthy();
		});

		it('should or together other operators, return false when none matches', () => {
			expect(assertion('bar')).toBeFalsy();
		});

		it('should return false when matching with undefined', () => {
			expect(assertion(undefined)).toBeFalsy();
		});
	});

	describe('matchRegExp', () => {
		const assertion = matchRegExp(/fo.*/);

		it('should return true when the criteria regexp matches', () => {
			expect(assertion('foo')).toBeTruthy();
		});

		it('should return false when the criteria regexp does not match', () => {
			expect(assertion('bar')).toBeFalsy();
		});

		it('should return false when matching with undefined', () => {
			expect(assertion(undefined)).toBeFalsy();
		});
	});

	describe('a more complex usecase', () => {
		const predicate = or(and(contains('fo'), contains('oo')), equal('bar'));

		it('should be able to nest predicates deeply', () => {
			expect(predicate('foo')).toBeTruthy();
			expect(predicate('bar')).toBeTruthy();
			expect(predicate('zed')).toBeFalsy();
		});
	});
});
