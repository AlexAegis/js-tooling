/**
 * This function will process async tasks in batches, limited by the bufferSize.
 * Since it needs to have control over when promises start (and since promises
 * are always hot) instead of promises you need to pass functions that return
 * the promises.
 *
 * @param tasks an array of Promise factories (async functions)
 * @param bufferSize (default 25) at most, this many tasks will be running at a time
 * @returns the results of each promise in the order they resolved or rejected
 */
export const bufferedAllSettled = async <T>(
	tasks: (() => Promise<T>)[],
	bufferSize = 25,
): Promise<PromiseSettledResult<T>[]> => {
	const buffer = new Map<() => Promise<T>, Promise<unknown>>();
	const results: PromiseSettledResult<T>[] = [];
	while (tasks.length > 0) {
		while (buffer.size < bufferSize) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const task = tasks.shift()!;
			const promise = task()
				.then((value) => {
					results.push({ status: 'fulfilled', value });
					buffer.delete(task);
					return value;
				})
				.catch((error: unknown) => {
					results.push({ status: 'rejected', reason: error });
					buffer.delete(task);
					return error;
				});
			buffer.set(task, promise);
		}
		await Promise.any(buffer.values());
	}
	await Promise.allSettled(buffer.values());
	return results;
};
