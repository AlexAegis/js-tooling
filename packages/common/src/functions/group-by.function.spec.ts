import { describe, expect, it } from 'vitest';
import { groupBy } from './group-by.function.js';

describe('groupBy', () => {
	it('should be able to group an array of things based on the keyer fn', () => {
		const elements = [1, 2, 3, 4];

		const grouped = groupBy(elements, (e) => (e % 2 === 0 ? 'even' : 'odd'));
		expect(grouped.odd).toEqual([1, 3]);
		expect(grouped.even).toEqual([2, 4]);
	});

	it('should return an empty object for an empty array', () => {
		expect(groupBy([], () => '')).toEqual({});
	});
});
