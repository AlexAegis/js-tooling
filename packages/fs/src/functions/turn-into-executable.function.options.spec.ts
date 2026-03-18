import { noopLogger } from '@alexaegis/logging';
import { describe, expect, it, vi } from 'vitest';
import {
	normalizeTurnIntoExecutableOptions,
	type NormalizedTurnIntoExecutableOptions,
	type TurnIntoExecutableOptions,
} from './turn-into-executable.function.options.js';

export const mockProcessCwdValue = '/foo';

vi.spyOn(process, 'cwd').mockReturnValue(mockProcessCwdValue);

describe('normalizeTurnIntoExecutableOptions', () => {
	it('should have a default when not defined', () => {
		expect(normalizeTurnIntoExecutableOptions()).toEqual({
			cwd: mockProcessCwdValue,
			logger: noopLogger,
		} as NormalizedTurnIntoExecutableOptions);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: TurnIntoExecutableOptions = {
			cwd: '/foo/bar',
			logger: noopLogger,
		};
		expect(normalizeTurnIntoExecutableOptions(manualOptions)).toEqual(manualOptions);
	});
});
