import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from './sleep.function.js';

describe('sleep', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it('should be a noop when the timeout is 0 or less', () => {
		void sleep(0);
		expect(vi.getTimerCount()).toBe(0);
	});

	it('should be a noop when the timeout is 0 or less', () => {
		void sleep(100);
		expect(vi.getTimerCount()).toBe(1);
		vi.advanceTimersByTime(100);
		expect(vi.getTimerCount()).toBe(0);
	});
});
