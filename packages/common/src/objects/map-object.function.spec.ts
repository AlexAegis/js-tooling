import { describe, expect, it } from 'vitest';
import { mapObject } from './map-object.function.js';

describe('mapObject', () => {
	it('should copy an object', () => {
		expect(mapObject({ a: 1, b: 2 }, (value) => value + 1)).toEqual({ a: 2, b: 3 });
	});
});
