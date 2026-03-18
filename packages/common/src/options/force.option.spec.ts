import { describe, expect, it } from 'vitest';
import {
	normalizeForceOption,
	type ForceOption,
	type NormalizedForceOption,
} from './force.option.js';

describe('normalizeForceOption', () => {
	it('should have a default when not defined', () => {
		expect(normalizeForceOption()).toEqual({
			force: false,
		} as NormalizedForceOption);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: ForceOption = {
			force: true,
		};
		expect(normalizeForceOption(manualOptions)).toEqual(manualOptions);
	});
});
