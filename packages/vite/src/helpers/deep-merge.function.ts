export type ObjectKey = string | number | symbol;

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<ObjectKey, unknown> {
	return item !== null && item !== undefined && typeof item === 'object' && !Array.isArray(item);
}

export const deepMerge = <T extends Record<ObjectKey, unknown>>(
	target: T,
	...sources: Partial<T>[]
): T => {
	if (sources.length === 0) {
		return target;
	}
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, { [key]: {} });
				}
				deepMerge(
					target[key] as Record<ObjectKey, unknown>,
					source[key] as Record<ObjectKey, unknown>
				);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return deepMerge(target, ...sources);
};
