import { describe, expect, it } from 'vitest';
import { deepMerge } from './deep-merge.function.js';

describe('deepMerge', () => {
	const foo = { foo: { bar: { a: 1, b: 2 } } };
	const bar = { foo: { bar: { a: 6, c: 7 } }, zed: 4 };
	const manuallyMerged = { foo: { bar: { a: 6, b: 2, c: 7 } }, zed: 4 };

	it('should merge two objects together', () => {
		const merged = deepMerge(foo, bar);
		expect(JSON.stringify(merged)).toBe(JSON.stringify(manuallyMerged));
	});
});
