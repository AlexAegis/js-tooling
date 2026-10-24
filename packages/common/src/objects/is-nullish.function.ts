// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- removing T would break callers that pass a type argument
export const isNullish = <T>(o: T | undefined | null): o is undefined | null =>
	o === undefined || o === null;
