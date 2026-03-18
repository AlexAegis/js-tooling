// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface MemoizeOptions<F extends (...args: any) => unknown, T = unknown> {
	/**
	 * @defaultValue undefined
	 */
	thisContext?: T | undefined;
	/**
	 *
	 * @defaultValue JSON.stringify
	 */
	argHasher?: (args: Parameters<F>) => string;
	/**
	 * @defaultValue Infinity
	 */
	maxCacheEntries?: number;

	cache?: Map<string, ReturnType<F>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NormalizedMemoizeOptions<F extends (...args: any) => unknown, T = unknown> = Required<
	Omit<MemoizeOptions<F, T>, 'thisContext'>
> &
	Pick<MemoizeOptions<F, T>, 'thisContext'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeMemoizeOptions = <F extends (...args: any) => unknown, T>(
	options?: MemoizeOptions<F, T>,
): NormalizedMemoizeOptions<F, T> => {
	return {
		argHasher: options?.argHasher ?? JSON.stringify,
		thisContext: options?.thisContext,
		maxCacheEntries: options?.maxCacheEntries ?? Number.POSITIVE_INFINITY,
		cache: options?.cache ?? new Map<string, ReturnType<F>>(),
	};
};
