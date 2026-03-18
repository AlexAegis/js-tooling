import { describe, expect, it } from 'vitest';
import {
	LogLevel,
	isLogLevelEnumKey,
	isLogLevelEnumValue,
	logLevelKeys,
	logLevelValues,
} from './log-level.enum.js';

describe('LogLevel', () => {
	describe('isLogLevelEnumValue', () => {
		it('should tell for every used logLevel value that it is a logLevel', () => {
			expect(logLevelKeys).toBeTruthy();
			expect(logLevelValues).toBeTruthy();

			expect(isLogLevelEnumValue(LogLevel.OFF)).toBeTruthy();
			for (let i = 0; i <= 6; i++) {
				expect(isLogLevelEnumValue(i)).toBeTruthy();
			}
		});

		it('should tell for every non used logLevel value that it is not a logLevel', () => {
			expect(isLogLevelEnumValue(Number.NEGATIVE_INFINITY)).toBeFalsy();
			expect(isLogLevelEnumValue(7)).toBeFalsy();
		});

		it('should report false for undefined', () => {
			expect(isLogLevelEnumValue(undefined)).toBeFalsy();
		});
	});

	describe('isLogLevelEnumKey', () => {
		it('should tell for every used logLevel value that it is a logLevel', () => {
			expect(isLogLevelEnumKey('OFF')).toBeTruthy();
			expect(isLogLevelEnumKey('FATAL')).toBeTruthy();
			expect(isLogLevelEnumKey('ERROR')).toBeTruthy();
			expect(isLogLevelEnumKey('WARN')).toBeTruthy();
			expect(isLogLevelEnumKey('INFO')).toBeTruthy();
			expect(isLogLevelEnumKey('DEBUG')).toBeTruthy();
			expect(isLogLevelEnumKey('TRACE')).toBeTruthy();
			expect(isLogLevelEnumKey('SILLY')).toBeTruthy();
		});

		it('should tell for every non used logLevel value that it is not a logLevel', () => {
			expect(isLogLevelEnumKey('FOO')).toBeFalsy();
			expect(isLogLevelEnumKey('BAR')).toBeFalsy();
		});

		it('should report false for undefined', () => {
			expect(isLogLevelEnumKey(undefined)).toBeFalsy();
		});
	});
});
