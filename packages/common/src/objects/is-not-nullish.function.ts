export const isNotNullish = <T>(o: T | undefined | null): o is NonNullable<T> =>
	o !== undefined && o !== null;
