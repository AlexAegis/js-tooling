export type ObjectKey = string | number;

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): item is Record<ObjectKey, unknown> {
	return item !== null && item !== undefined && typeof item === 'object' && !Array.isArray(item);
}
