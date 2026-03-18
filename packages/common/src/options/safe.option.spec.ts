import { describe, expect, it } from 'vitest';
import { normalizeSafeOption, type NormalizedSafeOption, type SafeOption } from './safe.option.js';

describe('normalizeSafeOption', () => {
	it('should have a default when not defined', () => {
		expect(normalizeSafeOption()).toEqual({
			safe: false,
		} as NormalizedSafeOption);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: SafeOption = {
			safe: true,
		};
		expect(normalizeSafeOption(manualOptions)).toEqual(manualOptions);
	});
});
