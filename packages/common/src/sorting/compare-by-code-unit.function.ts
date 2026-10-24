/**
 * Compares strings by their UTF-16 code units, the order of a `sort()` without
 * a compare function. Unlike `localeCompare`, it does not depend on the locale.
 */
export const compareByCodeUnit = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);
