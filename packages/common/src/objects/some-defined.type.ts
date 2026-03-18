import type { Defined } from './defined.type.js';

/**
 * Mark only selected variables as defined
 */
export type SomeDefined<T, K extends keyof T = keyof T> = Defined<Pick<T, K>> & Omit<T, K>;
