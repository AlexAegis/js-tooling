/**
 * Returns whatever you pass to it.
 */
export const identity = <V>(r?: V) => r;

/**
 * Returns whatever you pass to it. Asynchronously. While the regular
 * `identity` function is already awaitable, this one is always thenable.
 */
export const identityAsync = async <V>(value?: V, mode: 'micro' | 'macro' = 'micro') =>
	new Promise((resolve) => {
		if (mode === 'micro') {
			resolve(value);
		} else {
			setTimeout(() => {
				resolve(value);
			}, 0);
		}
	});
