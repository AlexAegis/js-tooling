import { describe, expect, it } from 'vitest';
import { deepFreeze } from './deep-freeze.function.js';

describe('deepFreeze', () => {
	describe('tree like objects', () => {
		it('should be able freeze a simple object', () => {
			const object = {
				foo: 'foo',
			};
			const unmodifiedCopy = structuredClone(object);
			deepFreeze(object);
			expect(() => {
				object.foo = 'change';
			}).toThrow();

			expect(object).toEqual(unmodifiedCopy);
		});

		it('should be able to freeze deeply nested object', () => {
			const object = {
				foo: {
					bar: 'bar',
				},
			};
			const unmodifiedCopy = structuredClone(object);
			deepFreeze(object);
			expect(() => {
				object.foo.bar = 'change';
			}).toThrow();

			expect(object).toEqual(unmodifiedCopy);
		});
	});

	describe('objects with circles', () => {
		it('should not crash when a object contains a circular reference', () => {
			const object: Record<string, unknown> = {
				foo: {
					bar: 'bar',
				},
			};
			object['circular'] = object;

			const unmodifiedCopy = structuredClone(object);
			expect(() => {
				deepFreeze(object);
			}).not.toThrow();
			expect(() => {
				object['another'] = 'change';
			}).toThrow();

			expect(object).toEqual(unmodifiedCopy);
		});
	});
});
