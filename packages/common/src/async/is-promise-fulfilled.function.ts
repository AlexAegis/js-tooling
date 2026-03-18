export const isPromiseFulfilled = <T>(
	promiseResult: PromiseSettledResult<T>,
): promiseResult is PromiseFulfilledResult<T> => {
	return promiseResult.status === 'fulfilled';
};
