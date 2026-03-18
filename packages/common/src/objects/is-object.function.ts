import type { SimpleObjectKey } from '../objects/struct.type.js';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<SimpleObjectKey, unknown> {
	return item !== null && item !== undefined && typeof item === 'object' && !Array.isArray(item);
}
