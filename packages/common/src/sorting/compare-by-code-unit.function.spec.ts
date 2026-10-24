import { describe, expect, it } from 'vitest';
import { compareByCodeUnit } from './compare-by-code-unit.function.js';

describe('compareByCodeUnit', () => {
	it('should order by code unit, uppercase and punctuation first', () => {
		expect(['b', 'a', 'B', '.x', 'a'].toSorted(compareByCodeUnit)).toEqual([
			'.x',
			'B',
			'a',
			'a',
			'b',
		]);
	});
});
