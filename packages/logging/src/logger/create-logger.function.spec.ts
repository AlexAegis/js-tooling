import { describe, expect, it } from 'vitest';
import { createLogger, prettyLogTemplateTimestamp } from './create-logger.function.js';

describe('createLogger', () => {
	it('should not include the timestamp in the template by default', () => {
		const logger = createLogger();
		expect(logger.settings.prettyLogTemplate).not.toContain(prettyLogTemplateTimestamp);
	});

	it('should include the timestamp in the template if enabled', () => {
		const logger = createLogger({
			timestamps: true,
		});
		expect(logger.settings.prettyLogTemplate).toContain(prettyLogTemplateTimestamp);
	});
});
