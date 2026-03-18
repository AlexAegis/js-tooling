/**
 * Applies Object.freeze deeply, as seen on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 *
 * @returns the same object but frozen.
 */
export const deepFreeze = <T>(object: T, dontFreeze = new Set()): T => {
	dontFreeze.add(object);
	const propNames = Reflect.ownKeys(object as object);
	for (const name of propNames) {
		const value = (object as Record<string | number | symbol, unknown>)[name];

		if (
			((value && typeof value === 'object') || typeof value === 'function') &&
			!dontFreeze.has(value)
		) {
			deepFreeze(value as T, dontFreeze);
		}
	}

	return Object.freeze(object);
};
