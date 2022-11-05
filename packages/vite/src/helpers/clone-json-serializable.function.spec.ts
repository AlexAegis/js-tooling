import { describe, expect, it } from 'vitest';
import { cloneJsonSerializable } from './clone-json-serializable.function.js';

describe('cloneJsonSerializable', () => {
	const foo = { foo: { bar: { a: 1, b: 2 } } };

	it('should create an exact copy that is deeply not the same object', () => {
		const clonedFoo = cloneJsonSerializable(foo);
		expect(JSON.stringify(foo)).toBe(JSON.stringify(clonedFoo));
		expect(foo).not.toBe(clonedFoo);
		expect(foo.foo).not.toBe(clonedFoo.foo);
		expect(foo.foo.bar).not.toBe(clonedFoo.foo.bar);
	});
});
