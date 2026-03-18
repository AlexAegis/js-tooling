import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from '../functions/sleep.function.js';
import { asyncFilter } from './async-filter.function.js';

const rejection = new Error('error');

const slowFilter = async (i: number): Promise<boolean> => {
	await sleep(100);
	if (i < 0) {
		throw rejection;
	}
	return i % 2 === 0;
};

describe('asyncFilter', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it('should resolve promises concurrently', async () => {
		const promise = asyncFilter([1, 2], slowFilter);
		expect(vi.getTimerCount()).toEqual(2);
		vi.advanceTimersByTime(100);
		const result = await promise;
		expect(result).toEqual([2]);
		expect(vi.getTimerCount()).toEqual(0);
	});

	it('should not let errors escape and instead treat them as failed predicates', async () => {
		const promise = asyncFilter([1, 2, -1], slowFilter);
		expect(vi.getTimerCount()).toEqual(3);
		vi.advanceTimersByTime(100);
		const result = await promise;
		expect(result).toEqual([2]);
		expect(vi.getTimerCount()).toEqual(0);
	});
});
