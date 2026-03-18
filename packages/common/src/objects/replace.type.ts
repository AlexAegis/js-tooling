/**
 * Replaces every key of T with every key of O that is matching.
 */
export type Replace<T, O> = { [K in keyof T]: K extends keyof O ? O[K] : T[K] };
