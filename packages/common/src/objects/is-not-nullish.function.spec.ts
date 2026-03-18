import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNotNullish } from './is-not-nullish.function.js';

describe('isNotNullish', () => {
	let optionalFoo: string | undefined | null;

	const fun = vi.fn();

	it('should not call the function if the field is undefined', () => {
		optionalFoo = undefined;

		if (isNotNullish(optionalFoo)) {
			fun();
		}
		expect(fun).not.toBeCalled();
	});

	it('should not call the function if the field is null', () => {
		// eslint-disable-next-line unicorn/no-null
		optionalFoo = null;

		if (isNotNullish(optionalFoo)) {
			fun();
		}
		expect(fun).not.toBeCalled();
	});

	it('should call the function if the field is not nullish', () => {
		optionalFoo = 'foo';

		if (isNotNullish(optionalFoo)) {
			fun();
		}
		expect(fun).toBeCalled();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});
});
