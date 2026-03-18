import { afterEach, describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize.function.js';

describe('memoize', () => {
	const add = vi.fn((n: number, m: number) => n + m);

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('pure functions', () => {
		it('should only call a memoized function once', () => {
			const memoizedAdd = memoize(add);

			expect(memoizedAdd(1, 2)).toBe(3);
			expect(memoizedAdd(1, 2)).toBe(3);
			expect(add).toHaveBeenCalledTimes(1);
		});
	});

	describe('using a different hasher', () => {
		it('should only call a memoized function once', () => {
			const memoizedAdd = memoize(add, {
				argHasher: ([n, _m]) => n.toString(),
			});
			// Even though the second call is different, this hasher ignores the second param
			expect(memoizedAdd(1, 2)).toBe(3);
			expect(memoizedAdd(1, 3)).toBe(3);
			expect(add).toHaveBeenCalledTimes(1);
		});
	});

	describe('maxCache', () => {
		it('should only hold as many cache entries as you allow it', () => {
			const memoizedAdd = memoize(add, { maxCacheEntries: 2 });

			memoizedAdd(1, 2);
			expect(add).toHaveBeenCalledTimes(1);
			memoizedAdd(1, 3);
			expect(add).toHaveBeenCalledTimes(2);
			// Now cache is filled, but calling any of the previously called does not increase calls
			memoizedAdd(1, 2);
			memoizedAdd(1, 3);
			expect(add).toHaveBeenCalledTimes(2);

			// Adding a new kind of call drops the oldest cache
			memoizedAdd(9, 9);
			expect(add).toHaveBeenCalledTimes(3);
			// Now these two entries are in the cache
			memoizedAdd(9, 9);
			memoizedAdd(1, 3);
			expect(add).toHaveBeenCalledTimes(3);

			// But this one was dropped so it has to be calculated again
			memoizedAdd(1, 2);
			expect(add).toHaveBeenCalledTimes(4);
			// Then this one got dropped, and so on and so on
			memoizedAdd(1, 3);
			expect(add).toHaveBeenCalledTimes(5);
		});
	});

	describe('class without a decorator', () => {
		it('should retain the this context of the memoized function', () => {
			class Foo {
				m: number;

				constructor(m: number) {
					this.m = m;
				}

				add(n: number): number {
					return this.m + n;
				}
			}

			const addSpy = vi.spyOn(Foo.prototype, 'add');

			const foo = new Foo(2);

			// eslint-disable-next-line @typescript-eslint/unbound-method
			const memoizedFooAdd = memoize(foo.add, { thisContext: foo });

			const firstResult = memoizedFooAdd(1);
			const secondResult = memoizedFooAdd(1);

			expect(firstResult).toBe(3);
			expect(secondResult).toBe(3);
			expect(addSpy).toHaveBeenCalledTimes(1);
		});
	});
});
