import { describe, expect, it } from 'vitest';
import { dropKeys } from './drop-keys.function.js';

describe('dropKeys', () => {
	it('should drop undefined by default', () => {
		const o = { foo: undefined };
		const result = dropKeys(o);
		expect(result).toBe(o); // Mutates
		expect(Object.hasOwn(result, 'foo')).toBeFalsy();
	});

	it('should drop whatever the matcher says should be dropped', () => {
		const o = { foo: undefined, bar: 1, zed: 'zed' };
		const result = dropKeys(o, (v) => typeof v === 'number');
		expect(result).toBe(o); // Mutates
		expect(Object.hasOwn(result, 'foo')).toBeTruthy();
		expect(Object.hasOwn(result, 'bar')).toBeFalsy();
		expect(Object.hasOwn(result, 'zed')).toBeTruthy();
	});

	it('should drop undefined by default in deeper objects too', () => {
		const o = { foo: undefined, bar: { zed: undefined } };
		const result = dropKeys(o);
		expect(result).toBe(o); // Mutates
		expect(Object.hasOwn(result, 'foo')).toBeFalsy();
		expect(Object.hasOwn(result, 'bar')).toBeTruthy();
		expect(Object.hasOwn(result.bar, 'zed')).toBeFalsy();
	});
});
