/**
 * This function will process async tasks in batches, limited by the bufferSize.
 * Since it needs to have control over when promises start (and since promises
 * are always hot) instead of promises you need to pass functions that return
 * the promises.
 *
 * @param tasks an array of Promise factories (async functions)
 * @param bufferSize (default 25, at least 1) at most, this many tasks will be running at a time
 * @returns the results of each promise in the order they resolved or rejected
 */
export const bufferedAllSettled = async <T>(
	tasks: (() => Promise<T>)[],
	bufferSize = 25,
): Promise<PromiseSettledResult<T>[]> => {
	if (!(bufferSize >= 1)) {
		throw new RangeError(`bufferSize must be at least 1, got ${bufferSize.toString()}`);
	}
	// keyed by index, so the same function can be passed more than once
	const buffer = new Map<number, Promise<void>>();
	const results: PromiseSettledResult<T>[] = [];
	const settle = async (index: number, pending: Promise<T>): Promise<void> => {
		try {
			results.push({ status: 'fulfilled', value: await pending });
		} catch (error) {
			results.push({ status: 'rejected', reason: error });
		}
		buffer.delete(index);
	};
	for (const [index, task] of tasks.entries()) {
		if (buffer.size >= bufferSize) {
			await Promise.race(buffer.values());
		}
		// task() runs outside settle, so a synchronous throw still rejects bufferedAllSettled
		buffer.set(index, settle(index, task()));
	}
	await Promise.all(buffer.values());
	return results;
};
