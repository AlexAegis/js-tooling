import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sleep } from '../index.js';
import { bufferedAllSettled } from './buffered-all-settled.function.js';

const shouldError = (i: number): boolean => i % 2 === 0;

describe('bufferedAllSettled', () => {
	const taskDuration = 1000;
	const sleepingTask = async (): Promise<void> => {
		await sleep(taskDuration);
	};

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
		const tasks = Array.from({ length: totalNumberOfTasks }, () => sleepingTask);
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
		const tasks = Array.from({ length: totalNumberOfTasks }, (_, i) => {
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

	it('should limit and settle a task function that is passed more than once', async () => {
		let running = 0;
		let maxRunning = 0;
		const task = async (): Promise<void> => {
			running++;
			maxRunning = Math.max(maxRunning, running);
			await sleep(taskDuration);
			running--;
		};

		const promise = bufferedAllSettled(
			Array.from({ length: 5 }, () => task),
			2,
		);
		await vi.runAllTimersAsync();
		const result = await promise;

		expect(maxRunning).toBe(2);
		expect(result).toHaveLength(5);
	});

	it.each([0, NaN])('should reject the buffer size %s', async (bufferSize) => {
		await expect(bufferedAllSettled([() => Promise.resolve(1)], bufferSize)).rejects.toThrow(
			RangeError,
		);
	});

	it('should not change the array of tasks', async () => {
		const tasks = [() => Promise.resolve(1), () => Promise.resolve(2)];

		await bufferedAllSettled(tasks);

		expect(tasks).toHaveLength(2);
	});

	it('should settle every task when there are fewer tasks than the buffer size', async () => {
		const tasks = Array.from({ length: 2 }, (_, i) => () => Promise.resolve(i));

		const result = await bufferedAllSettled(tasks);

		expect(result).toEqual([
			{ status: 'fulfilled', value: 0 },
			{ status: 'fulfilled', value: 1 },
		]);
	});
});
