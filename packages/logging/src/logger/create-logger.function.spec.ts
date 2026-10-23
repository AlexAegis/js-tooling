import { describe, expect, it } from 'vitest';
import { createLogger, prettyLogTemplateTimestamp } from './create-logger.function.js';
import { LogLevel } from './log-level.enum.js';

describe('createLogger', () => {
	it('should not include the timestamp in the template by default', () => {
		const logger = createLogger();
		expect(logger.settings.pretty.template).not.toContain(prettyLogTemplateTimestamp);
	});

	it('should include the timestamp in the template if enabled', () => {
		const logger = createLogger({
			timestamps: true,
		});
		expect(logger.settings.pretty.template).toContain(prettyLogTemplateTimestamp);
	});

	it('should let the template be overridden', () => {
		const logger = createLogger({ pretty: { template: 'custom' } });
		expect(logger.settings.pretty.template).toBe('custom');
	});

	it('should not pass its own options to tslog', () => {
		expect(() => createLogger({ strictConfig: true, timestamps: true })).not.toThrow();
	});

	it('should accept LogLevel.OFF and filter out every log', () => {
		const records: unknown[] = [];
		const logger = createLogger({ strictConfig: true, minLevel: LogLevel.OFF });
		logger.attachTransport((record) => {
			records.push(record);
		});

		logger.fatal('hidden');

		expect(records).toHaveLength(0);
	});

	it('should keep the sub-loggers of an OFF logger off', () => {
		const records: unknown[] = [];
		const logger = createLogger({ strictConfig: true, minLevel: LogLevel.OFF });
		const subLogger = logger.getSubLogger({ name: 'sub' });
		subLogger.attachTransport((record) => {
			records.push(record);
		});

		subLogger.fatal('hidden');

		expect(records).toHaveLength(0);
	});
});
