import { isNonNullable } from './non-nullable.function';

describe('nonNullable', () => {
	let optionalFoo: string | undefined | null;

	const fun = jest.fn();

	it('should not call the function if the field is undefined', () => {
		optionalFoo = undefined;

		if (isNonNullable(optionalFoo)) {
			fun();
		}
		expect(fun).not.toBeCalled();
	});

	it('should not call the function if the field is null', () => {
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

	afterEach(() => jest.resetAllMocks());
});
