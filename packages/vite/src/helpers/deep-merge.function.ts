import { isObject, ObjectKey } from './is-object.function.js';

export const deepMerge = <
	T extends Record<ObjectKey, unknown>,
	S extends T | Record<ObjectKey, unknown>
>(
	target: T,
	...sources: (S | undefined)[]
): T & S => {
	if (sources.length === 0) {
		return target as T & S;
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
