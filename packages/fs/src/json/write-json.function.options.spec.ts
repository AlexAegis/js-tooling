import { noopLogger } from '@alexaegis/logging';
import { describe, expect, it } from 'vitest';
import {
	normalizeWriteJsonOptions,
	type NormalizedWriteJsonOptions,
	type WriteJsonOptions,
} from './write-json.function.options.js';

describe('WriteJsonFunctionOptions', () => {
	it('should have a default when not defined', () => {
		expect(normalizeWriteJsonOptions()).toEqual({
			autoPrettier: true,
			dry: false,
			cwd: process.cwd(),
			logger: noopLogger,
		} as NormalizedWriteJsonOptions);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: WriteJsonOptions = {
			autoPrettier: false,
			dry: true,
			cwd: 'foo',
			logger: noopLogger,
		};
		expect(normalizeWriteJsonOptions(manualOptions)).toEqual(manualOptions);
	});
});
