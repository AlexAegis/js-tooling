import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from '../index.js';
import { bufferedAllSettled } from './buffered-all-settled.function.js';

const shouldError = (i: number): boolean => i % 2 === 0;

describe('bufferedAllSettled', () => {
	const taskDuration = 1000;

	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.clearAllMocks();
	});

	it('should clear timers in batches', async () => {
		const totalNumberOfTasks = 10;
		const bufferSize = 4;
		const tasks = Array.from({ length: totalNumberOfTasks }).map(() => {
			return async () => {
				await sleep(taskDuration);
			};
		});
		expect(vi.getTimerCount()).toEqual(0);
		const promise = bufferedAllSettled(tasks, bufferSize);
		expect(vi.getTimerCount()).toEqual(bufferSize);
		await vi.runOnlyPendingTimersAsync();
		expect(vi.getTimerCount()).toEqual(bufferSize);
		await vi.runOnlyPendingTimersAsync();
		expect(vi.getTimerCount()).toEqual(totalNumberOfTasks - bufferSize - bufferSize);
		await vi.runOnlyPendingTimersAsync();
		expect(vi.getTimerCount()).toEqual(0);
		await promise;
		expect(vi.getTimerCount()).toEqual(0);
	});

	it('should collect errors too', async () => {
		const totalNumberOfTasks = 10;
		const bufferSize = 5;
		const tasks = Array.from({ length: totalNumberOfTasks }).map((_, i) => {
			return async () => {
				await sleep(taskDuration);
				if (shouldError(i)) {
					throw new Error(i.toString());
				}
				return i;
			};
		});
		expect(vi.getTimerCount()).toEqual(0);
		const promise = bufferedAllSettled(tasks, bufferSize);
		expect(vi.getTimerCount()).toEqual(bufferSize);
		await vi.runOnlyPendingTimersAsync();
		expect(vi.getTimerCount()).toEqual(bufferSize);
		await vi.runOnlyPendingTimersAsync();
		expect(vi.getTimerCount()).toEqual(0);
		const result = await promise;
		expect(vi.getTimerCount()).toEqual(0);

		for (let i = 0; i < result.length; i++) {
			const status = result[i]?.status;
			if (shouldError(i)) {
				expect(status).toEqual('rejected');
			} else {
				expect(status).toEqual('fulfilled');
			}
		}
	});
});
