export declare const __brand: unique symbol;
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- an interface would not be assignable to Record<string, unknown>
export type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;
export type LoosenBrand<T extends Branded<unknown, unknown>> = Omit<T, typeof __brand> & {
	[__brand]?: T[typeof __brand];
};
export type BrandedLoosely<T, B> = LoosenBrand<Branded<T, B>>;
