import { describe, expect, it } from 'vitest';
import { deepMerge } from './deep-merge.function.js';

describe('deepMerge', () => {
	it('should be able to merge two simple objects together', () => {
		const a = { a: 'a' };
		const b = { b: 'b' };

		const result = deepMerge([a, b]);
		const expected = { a: 'a', b: 'b' };

		expect(result).toEqual(expected);
	});

	it('should be able to merge multiple shallow objects and mutate the target', () => {
		const a = { a: 'a' };
		const b = { b: 'b' };
		const c = { c: 'c' };

		const result = deepMerge([a, b, c]);
		const expected = { a: 'a', b: 'b', c: 'c' };

		expect(result).toEqual(expected);
	});

	it('should be able to merge objects with circular references', () => {
		const a = { a: 'a' };
		const b: { b: string; circle?: unknown } = { b: 'b' };
		b.circle = b;
		const c = { c: 'c' };

		const result = deepMerge([a, b, c]);
		const expected = { a: 'a', b: 'b', circle: b, c: 'c' };

		expect(result).toEqual(expected);
	});

	it('should be able to merge deeper objects and mutate the target', () => {
		const a = { a: 'a', deep: { foo: 'foo' } };
		const b = { b: 'b', another: {} };
		const c = { c: 'c', deep: { bar: 'bar' } };

		const result = deepMerge([a, b, c]);
		const expected = { a: 'a', b: 'b', c: 'c', deep: { foo: 'foo', bar: 'bar' }, another: {} };

		expect(result).toEqual(expected);
	});

	it('should be able to delete items that are explicitly undefined in the sources', () => {
		const a = { a: 'a', deleteMe: 'delete', keepMeHere: 'keepMeHere' };
		const b = { deleteMe: undefined };

		const result = deepMerge([a, b]);
		const expected = { a: 'a', keepMeHere: 'keepMeHere' };

		expect(result).toEqual(expected);
	});

	it('should be able to merge arrays too', () => {
		const a = [1, 2, 3];
		const b = [3, 4, 5];

		const result = deepMerge([a, b]);
		const expected = [1, 2, 3, 4, 5];

		expect(result).toEqual(expected);
	});

	it('should be add arrays', () => {
		const a = {};
		const b = { arr: [1, 2, 3] };

		const result = deepMerge([a, b]);
		const expected = { arr: [1, 2, 3] };

		expect(result).toEqual(expected);
	});

	it('should keep the latest value when multiple object have the same key', () => {
		const a = { foo: 'a' };
		const b = { foo: 'b' };
		const c = { foo: 'c' };

		const result = deepMerge([a, b, c]);
		const expected = { foo: 'c' };

		expect(result).toEqual(expected);
	});

	it('should keep a field undefined when preferUndefined is true even if something would define the field later', () => {
		const a = { foo: 'a' };
		const b = { foo: undefined };
		const c = { foo: 'b' };

		const result = deepMerge([a, b, c], { preferUndefined: true });
		const expected = { foo: undefined };

		expect(result).toEqual(expected);
		expect(Object.hasOwn(result, 'foo')).toBeTruthy();
	});

	it('should drop an undefined field when preferUndefined is true and dropKeys is enabled even if something would define the field later', () => {
		const a = { foo: 'a' };
		const b = { foo: undefined };
		const c = { foo: 'b' };

		const result = deepMerge([a, b, c], { preferUndefined: true, dropKeys: true });
		const expected = {};

		expect(result).toEqual(expected);
		expect(Object.hasOwn(result, 'foo')).toBeFalsy();
	});

	it('should drop what the dropKeyMatcher says', () => {
		const a = { foo: 'a', bar: 12 };
		const b = { foo: 'b' };

		const result = deepMerge([a, b], { dropKeys: (value) => typeof value === 'number' });
		const expected = { foo: 'b' };

		expect(result).toEqual(expected);
		expect(Object.hasOwn(result, 'bar')).toBeFalsy();
	});

	it('should be able to drop deeper fields too', () => {
		const a = {
			devDependencies: {
				'@org/foo': '1',
				'@org/bar': '1',
			},
		};
		const b = {
			devDependencies: {
				'@org/bar': undefined,
			},
		};

		const result = deepMerge([a, b], { dropKeys: true });
		const expected = {
			devDependencies: {
				'@org/foo': '1',
			},
		};

		expect(result).toEqual(expected);
		expect(Object.hasOwn(result.devDependencies, '@org/bar')).toBeFalsy();
	});
});
