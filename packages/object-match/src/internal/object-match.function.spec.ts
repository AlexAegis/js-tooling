import { describe, expect, it } from 'vitest';
import { objectMatch, type JsonMatcher } from './object-match.function.js';

describe('objectMatch', () => {
	it('should match with itself', () => {
		const target = {
			foo: 'foo',
		};

		const result = objectMatch(target, target);

		expect(result).toBeTruthy();
	});

	it('should match using a regex', () => {
		const target = {
			foo: 'foo',
		};

		const filter = {
			foo: /^foo$/,
		};
		const result = objectMatch(target, filter);

		expect(result).toBeTruthy();
	});

	it('should allow extra keys by default', () => {
		const target = {
			foo: 'foo',
			extra: 'key',
		};

		const filter = {
			foo: /^foo$/,
		};
		const result = objectMatch(target, filter);

		expect(result).toBeTruthy();
	});

	it('should match with multiple types that are nested', () => {
		const target = {
			foo: 'foo',
			bar: {
				zed: 1,
				arr: [4, 3, 'ice', 'fire'],
			},
		};

		const filter: JsonMatcher = {
			foo: /^foo$/,
			bar: {
				zed: 1,
				arr: [
					(i) => typeof i === 'number' && i % 2 === 0,
					3,
					(value) => value === 'ice',
					'fire',
				],
			},
		};
		const result = objectMatch(target, filter);

		expect(result).toBeTruthy();
	});

	it('should not match if one propery is not matching', () => {
		const target = {
			foo: 'foo',
			bar: 'foo',
		};

		const filter = {
			foo: /^foo$/,
			bar: /^bar$/,
		};
		const result = objectMatch(target, filter);

		expect(result).toBeFalsy();
	});

	it('should be able to match booleans', () => {
		expect(objectMatch(true, true)).toBeTruthy();
	});

	it('should not match different booleans', () => {
		expect(objectMatch(true, false)).toBeFalsy();
		expect(objectMatch(false, true)).toBeFalsy();
	});

	it('should be able to match nested booleans', () => {
		expect(
			objectMatch(
				{
					foo: true,
				},
				{
					foo: true,
				}
			)
		).toBeTruthy();
	});

	it('should not match different nested booleans', () => {
		expect(
			objectMatch(
				{
					foo: true,
				},
				{
					foo: false,
				}
			)
		).toBeFalsy();
	});
});
