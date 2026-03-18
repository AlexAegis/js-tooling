/**
 * Mark only selected variables as required
 */
export type SomeRequired<T, K extends keyof T = keyof T> = Required<Pick<T, K>> & Omit<T, K>;
