import { describe, expect, it } from 'vitest';
import { noop } from '../index.js';
import { isPromiseLike } from './is-promise-like.function.js';

describe('isPromiseLike', () => {
	it('should be able to tell if a promise is promiselike', () => {
		const promise = new Promise(noop);
		expect(isPromiseLike(promise)).toBeTruthy();
	});

	it('should be able to tell if a promiselike object is promiselike', () => {
		// eslint-disable-next-line unicorn/no-thenable
		const promiseLike = { then: noop, catch: noop };
		expect(isPromiseLike(promiseLike)).toBeTruthy();
	});

	it('should be able to tell if a non promiselike object is not promiselike', () => {
		expect(isPromiseLike({})).toBeFalsy();
		expect(isPromiseLike(0)).toBeFalsy();
		expect(isPromiseLike('')).toBeFalsy();
		expect(isPromiseLike(noop)).toBeFalsy();
	});
});
