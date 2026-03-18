import { describe, expect, it } from 'vitest';
import { isObject } from './is-object.function.js';

describe('isObject', () => {
	it('should return true for an empty object', () => {
		expect(isObject({})).toBeTruthy();
	});

	it('should false for arrays', () => {
		expect(isObject([])).toBeFalsy();
	});

	it('should false for nullish values', () => {
		// eslint-disable-next-line unicorn/no-null
		expect(isObject(null)).toBeFalsy();
		expect(isObject(undefined)).toBeFalsy();
	});

	it('should false for primitives values', () => {
		expect(isObject(0)).toBeFalsy();
		expect(isObject(1)).toBeFalsy();
		expect(isObject('0')).toBeFalsy();
		expect(isObject('1')).toBeFalsy();
		expect(isObject('')).toBeFalsy();
	});
});
