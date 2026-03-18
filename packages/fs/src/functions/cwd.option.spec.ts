import { afterEach, beforeAll, describe, expect, it, vi, type MockInstance } from 'vitest';
import { normalizeCwdOption, type NormalizedCwdOption } from './cwd.option.js';

export const mockProcessCwdValue = '/foo';

export const mockProcessCwd = (): MockInstance<() => string> => {
	return vi.spyOn(process, 'cwd').mockReturnValue(mockProcessCwdValue);
};

describe('cwdOption', () => {
	let processCwdSpy: MockInstance<() => string>;

	beforeAll(() => {
		processCwdSpy = mockProcessCwd();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should default to process.cwd() when not defined', () => {
		expect(normalizeCwdOption()).toEqual({
			cwd: mockProcessCwdValue,
		} as NormalizedCwdOption);

		expect(processCwdSpy).toHaveBeenCalled();
	});

	it('should not call process.cwd() when cwd is overridden', () => {
		const cwdOverride = './foo';
		expect(normalizeCwdOption({ cwd: cwdOverride })).toEqual({
			cwd: cwdOverride,
		} as NormalizedCwdOption);

		expect(processCwdSpy).not.toHaveBeenCalled();
	});
});
