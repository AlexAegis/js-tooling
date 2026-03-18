import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from '../functions/sleep.function.js';
import { asyncFilterMap } from './async-filter-map.function.js';

const rejection = new Error('error');

const slowFilterMap = async (i: number): Promise<number | undefined> => {
	await sleep(100);
	if (i < 0) {
		throw rejection;
	}
	return i % 2 === 0 ? i + 0.5 : undefined;
};

describe('asyncFilterMap', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it('should resolve promises concurrently', async () => {
		const promise = asyncFilterMap([1, 2], slowFilterMap);
		expect(vi.getTimerCount()).toEqual(2);
		vi.advanceTimersByTime(100);
		const result = await promise;
		expect(result).toEqual([2.5]);
		expect(vi.getTimerCount()).toEqual(0);
	});

	it('should not let errors escape and instead treat them as failed predicates', async () => {
		const promise = asyncFilterMap([1, 2, -1], slowFilterMap);
		expect(vi.getTimerCount()).toEqual(3);
		vi.advanceTimersByTime(100);
		const result = await promise;
		expect(result).toEqual([2.5]);
		expect(vi.getTimerCount()).toEqual(0);
	});
});
