export const isNullish = <T>(o: T | undefined | null): o is undefined | null =>
	o === undefined || o === null;
