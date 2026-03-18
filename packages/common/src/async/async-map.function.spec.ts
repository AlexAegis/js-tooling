import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from '../functions/sleep.function.js';
import { asyncMap } from './async-map.function.js';

const rejection = new Error('error');

const fastIncrement = (i: number): number => {
	return i + 1;
};

const slowIncrement = async (i: number): Promise<number> => {
	await sleep(100);
	if (i < 0) {
		throw rejection;
	}
	return i + 1;
};

describe('asyncMap', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it('should resolve promises concurrently', async () => {
		const promise = asyncMap([1, 2], slowIncrement);
		expect(vi.getTimerCount()).toEqual(2);
		vi.advanceTimersByTime(100);
		const result = await promise;
		expect(result).toEqual([2, 3]);
		expect(vi.getTimerCount()).toEqual(0);
	});

	it('should also work with regular mapper functions', async () => {
		const result = await asyncMap([1, 2], fastIncrement);
		expect(vi.getTimerCount()).toEqual(0);
		expect(result).toEqual([2, 3]);
	});

	it('should just let errors escape', async () => {
		await expect(async () => {
			const promise = asyncMap([1, -1], slowIncrement);
			expect(vi.getTimerCount()).toEqual(2);
			vi.advanceTimersByTime(100);
			await promise;
		}).rejects.toEqual(rejection);

		expect(vi.getTimerCount()).toEqual(0);
	});
});
