import { isObject } from './is-object.function.js';

export const deepMapObject = <T>(
	o: T,
	mapper: (key: string | number, value: unknown) => unknown,
): T => {
	const target = { ...o };

	if (isObject(target)) {
		for (const key in target) {
			const value = target[key];
			if (isObject(value)) {
				Object.assign(target, { [key]: deepMapObject(value, mapper) });
			} else {
				const mapResult = mapper(key, value);
				if (mapResult === undefined) {
					// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
					delete target[key];
				} else {
					Object.assign(target, { [key]: mapResult });
				}
			}
		}
	}

	return target;
};
