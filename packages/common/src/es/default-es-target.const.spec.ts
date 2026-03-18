import { describe, expect, it } from 'vitest';
import { DEFAULT_ES_TARGET_NAME, DEFAULT_ES_TARGET_YEAR } from './default-es-target.const.js';

describe('default es target', () => {
	it('should be exported', () => {
		expect(DEFAULT_ES_TARGET_YEAR).toBeTruthy();
		expect(DEFAULT_ES_TARGET_NAME).toBeTruthy();
	});

	describe('name', () => {
		it('should contain the year', () => {
			expect(DEFAULT_ES_TARGET_NAME).toContain(DEFAULT_ES_TARGET_YEAR);
		});
	});
});
