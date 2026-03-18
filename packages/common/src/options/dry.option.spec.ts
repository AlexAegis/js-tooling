import { describe, expect, it } from 'vitest';
import { normalizeDryOption, type DryOption, type NormalizedDryOption } from './dry.option.js';

describe('normalizeDryOption', () => {
	it('should have a default when not defined', () => {
		expect(normalizeDryOption()).toEqual({
			dry: false,
		} as NormalizedDryOption);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: DryOption = {
			dry: true,
		};
		expect(normalizeDryOption(manualOptions)).toEqual(manualOptions);
	});
});
