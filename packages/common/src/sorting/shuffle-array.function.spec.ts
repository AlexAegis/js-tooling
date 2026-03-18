import { describe, expect, it } from 'vitest';
import { shuffleArray } from './shuffle-array.function.js';

describe('shuffleArray', () => {
	it('should return an array of the same size and every element still present', () => {
		const inputArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		const shuffled = shuffleArray([...inputArray]);
		expect(inputArray.length).toBe(shuffled.length);
		for (const letter of inputArray) {
			expect(shuffled).toContain(letter);
		}
	});
});
