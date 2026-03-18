/**
 * Similar to `Required` but also removes `undefined` and `null` from the type
 */
export type Defined<T> = { [K in keyof T]-?: NonNullable<T[K]> };
