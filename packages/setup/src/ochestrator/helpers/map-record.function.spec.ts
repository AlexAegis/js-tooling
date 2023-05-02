import { describe, expect, it } from 'vitest';
import { mapRecord } from './map-record.function.js';

describe('mapRecord', () => {
	it('should apply the map function to every value in an array', () => {
		const from = {
			foo: 1,
			bar: 2,
		};

		const expectedResult = {
			foo: 2,
			bar: 3,
		};

		expect(mapRecord(from, (v) => v + 1)).toEqual(expectedResult);
	});

	it('should work with empty records too', () => {
		expect(mapRecord({}, (_v) => undefined)).toEqual({});
	});
});
