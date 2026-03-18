/**
 * Mark some variables as optional, but not all.
 */
export type SomePartial<T, K extends keyof T = keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
