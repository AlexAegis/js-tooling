import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNullish } from './is-nullish.function.js';

describe('isNullish', () => {
	let optionalFoo: string | undefined | null;

	const fun = vi.fn();

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should call the function if the field is undefined', () => {
		optionalFoo = undefined;

		if (isNullish(optionalFoo)) {
			fun();
		}
		expect(fun).toBeCalled();
	});

	it('should call the function if the field is null', () => {
		// eslint-disable-next-line unicorn/no-null
		optionalFoo = null;

		if (isNullish(optionalFoo)) {
			fun();
		}
		expect(fun).toBeCalled();
	});

	it('should not call the function if the field is not nullish', () => {
		optionalFoo = 'foo';

		if (isNullish(optionalFoo)) {
			fun();
		}
		expect(fun).not.toBeCalled();
	});
});
