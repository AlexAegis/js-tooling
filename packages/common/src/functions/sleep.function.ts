export const sleep = (ms: number): Promise<void> => {
	return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
};
