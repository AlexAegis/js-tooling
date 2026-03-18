import { describe, expect, it } from 'vitest';
import { random } from './random.function.js';

describe('random', () => {
	const low = 3;
	const high = 12;

	it('should return a number within a range that is an integer', () => {
		const result = random(low, high);
		expect(result).toBeTypeOf('number');
		expect(result).to.be.lessThanOrEqual(high);
		expect(result).to.be.greaterThanOrEqual(low);
		expect(result).toEqual(Math.floor(result));
	});

	it('should handle ranges declared in the wrong order', () => {
		const result = random(high, low);
		expect(result).toBeTypeOf('number');
		expect(result).to.be.lessThanOrEqual(high);
		expect(result).to.be.greaterThanOrEqual(low);
		expect(result).toEqual(Math.floor(result));
	});
});
