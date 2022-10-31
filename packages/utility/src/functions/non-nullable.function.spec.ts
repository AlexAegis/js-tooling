import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNonNullable } from './non-nullable.function.js';

describe('nonNullable', () => {
	let optionalFoo: string | undefined | null;

	const fun = vi.fn();

	it('should not call the function if the field is undefined', () => {
		optionalFoo = undefined;

		if (isNonNullable(optionalFoo)) {
			fun();
		}
		expect(fun).not.toBeCalled();
	});

	it('should not call the function if the field is null', () => {
		// eslint-disable-next-line unicorn/no-null
		optionalFoo = null;

		if (isNonNullable(optionalFoo)) {
			fun();
		}
		expect(fun).not.toBeCalled();
	});

	it('should call the function if the field is not nullish', () => {
		optionalFoo = 'foo';

		if (isNonNullable(optionalFoo)) {
			fun();
		}
		expect(fun).toBeCalled();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});
});
