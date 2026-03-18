export type ItemOf<T extends readonly unknown[]> = T extends readonly (infer R)[] ? R : never;
