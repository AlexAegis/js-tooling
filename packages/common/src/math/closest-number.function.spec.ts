import { describe, expect, it } from 'vitest';
import { closestNumber } from './closest-number.function.js';

describe('closestNumber', () => {
	it('should find a number that is already in the array', () => {
		expect(closestNumber([0, 1], 1)).toBe(1);
	});

	it("should find the first closest number thats in the array if it's not in it", () => {
		expect(closestNumber([0, 2], 1)).toBe(0);
		expect(closestNumber([0, 3], 2)).toBe(3);
	});
});
