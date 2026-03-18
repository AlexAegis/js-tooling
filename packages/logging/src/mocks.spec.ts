import { describe, expect, it, vi } from 'vitest';
import { createMockLogger } from './mocks.js';

describe('mocks', () => {
	it('should exist', () => {
		const { logger, mockLogger } = createMockLogger(vi);

		expect(logger).toBeDefined();

		expect(mockLogger.silly).toBeDefined();
		expect(mockLogger.trace).toBeDefined();
		expect(mockLogger.debug).toBeDefined();
		expect(mockLogger.log).toBeDefined();
		expect(mockLogger.info).toBeDefined();
		expect(mockLogger.warn).toBeDefined();
		expect(mockLogger.fatal).toBeDefined();
		expect(mockLogger.error).toBeDefined();
		expect(mockLogger.attachTransport).toBeDefined();
		expect(mockLogger.getSubLogger).toBeDefined();
	});
});
