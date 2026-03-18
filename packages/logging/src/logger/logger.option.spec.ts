import { describe, expect, it } from 'vitest';
import { createLogger } from './create-logger.function.js';
import {
	normalizeLoggerOption,
	type LoggerOption,
	type NormalizedLoggerOption,
} from './logger.option.js';
import { noopLogger } from './noop-logger.const.js';

describe('normalizeLoggerOption', () => {
	it('should have a default when not defined', () => {
		expect(normalizeLoggerOption()).toEqual({
			logger: noopLogger,
		} as NormalizedLoggerOption);
	});

	it('should use the provided values when defined', () => {
		const manualOptions: LoggerOption = {
			logger: createLogger(),
		};
		expect(normalizeLoggerOption(manualOptions)).toEqual(manualOptions);
	});
});
