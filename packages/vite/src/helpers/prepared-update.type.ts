import type { Awaitable } from './awaitable.type.js';
import { deepMerge } from './deep-merge.function.js';
import type { ObjectKey } from './is-object.function.js';

export type PreparedCreateUpdates<T extends Record<ObjectKey, unknown>> = (
	t: T
) => Awaitable<Partial<T>>;

export type PreparedUpdate<T extends Record<ObjectKey, unknown>> = (t: T) => Awaitable<T>;

export const createPreparedUpdate = <T extends Record<ObjectKey, unknown>>(
	createUpdates: PreparedCreateUpdates<T>
): PreparedUpdate<T> => {
	return async (t) => {
		const updates = await createUpdates(t);
		return deepMerge(t, updates);
	};
};
