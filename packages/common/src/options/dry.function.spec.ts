import { afterEach, describe, expect, it, vi } from 'vitest';
import { dry, drySync } from './dry.function.js';

describe('dry', () => {
	const wetResult = 1;
	const dryResult = 2;

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('sync dry', () => {
		const fn = vi.fn(() => wetResult);

		it('should not call the original function when dry', () => {
			const driedFn = drySync(true, fn);
			expect(driedFn).not.toBe(fn);
			driedFn();
			expect(fn).not.toHaveBeenCalled();
		});

		it('should return what you pass to it otherwise', () => {
			const driedFn = drySync(false, fn);
			expect(driedFn).toBe(fn);
			driedFn();
			expect(fn).toHaveBeenCalled();
		});

		it('should be able to receive a default value to return when called dry', () => {
			const driedFn = drySync(true, fn, dryResult);
			expect(driedFn).not.toBe(fn);
			const result = driedFn();
			expect(result).toBe(dryResult);
			expect(fn).not.toHaveBeenCalled();
		});

		it('should be able to ignore the default value to return when not called dry', () => {
			const driedFn = drySync(false, fn, dryResult);
			expect(driedFn).toBe(fn);
			const result = driedFn();
			expect(result).toBe(wetResult);
			expect(fn).toHaveBeenCalled();
		});
	});

	describe('async dry', () => {
		const fn = vi.fn(
			() =>
				new Promise((resolve) => {
					resolve(wetResult);
				}),
		);

		it('should not call the original function when dry', async () => {
			const driedFn = dry(true, fn);
			expect(driedFn).not.toBe(fn);
			await driedFn();
			expect(fn).not.toHaveBeenCalled();
		});

		it('should return what you pass to it otherwise', async () => {
			const driedFn = dry(false, fn);
			expect(driedFn).toBe(fn);
			await driedFn();
			expect(fn).toHaveBeenCalled();
		});

		it('should be able to receive a default value to return when called dry', async () => {
			const driedFn = dry(true, fn, dryResult);
			expect(driedFn).not.toBe(fn);
			const result = await driedFn();
			expect(result).toBe(dryResult);
			expect(fn).not.toHaveBeenCalled();
		});

		it('should be able to ignore the default value to return when not called dry', async () => {
			const driedFn = dry(false, fn, dryResult);
			expect(driedFn).toBe(fn);
			const result = await driedFn();
			expect(result).toBe(wetResult);
			expect(fn).toHaveBeenCalled();
		});
	});
});
