/**
 * Does nothing.
 */
export const noop = () => undefined;

/**
 * Does nothing asynchronously as a macro-task.
 *
 */
export const noopAsync = (mode: 'micro' | 'macro' = 'micro') =>
	new Promise((resolve) => {
		if (mode === 'micro') {
			resolve(undefined);
		} else {
			setTimeout(() => {
				resolve(undefined);
			}, 0);
		}
	});
