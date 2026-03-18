export type MergeTuple<T extends unknown[]> = T extends [infer Head, ...infer Tail]
	? Head & MergeTuple<Tail>
	: unknown;
