import { identity, identityAsync } from '../index.js';

export interface DrySync {
	<T extends (...args: never) => unknown>(
		isDry: boolean,
		whenWet: T,
		dryDefault: ReturnType<T>,
	): T;
	<T extends (...args: never) => unknown>(isDry: true, whenWet: T, dryDefault?: ReturnType<T>): T;
	<T extends (...args: never) => unknown>(isDry: false, whenWet: T): T;
}

/**
 * Conditionally dries up a function. When a function is dry it will
 * no longer be called, instead it will return true
 */
export const drySync: DrySync = <T>(isDry: boolean, whenWet: T, dryDefault = true) => {
	return isDry ? () => identity(dryDefault) : whenWet;
};

export interface DryAsync {
	<T extends (...args: never) => Promise<unknown>>(
		isDry: boolean,
		whenWet: T,
		dryDefault?: Awaited<ReturnType<T>>,
	): T;
	<T extends (...args: never) => Promise<unknown>>(
		isDry: true,
		whenWet: T,
		dryDefault?: Awaited<ReturnType<T>>,
	): () => Promise<true>;
	<T extends (...args: never) => Promise<unknown>>(isDry: false, whenWet: T): T;
}

export const dry: DryAsync = <T>(isDry: boolean, whenWet: T, dryDefault = true) => {
	return isDry ? () => identityAsync(dryDefault) : whenWet;
};
