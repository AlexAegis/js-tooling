import { LogLevel } from '@alexaegis/logging';
import { describe, expect, it } from 'vitest';
import yargs from 'yargs';

import { yargsForLogLevelOption } from './log-level.yargs.js';

describe('yargsForLogLevelOption', () => {
	describe('--logLevel', () => {
		it('should parse LogLevel keys into values', async () => {
			const args = await yargsForLogLevelOption(yargs(['--logLevel', 'INFO'])).parseAsync();
			expect(args.logLevel).toBe(LogLevel.INFO);
		});

		it('should parse LogLevel values into values', async () => {
			const args = await yargsForLogLevelOption(yargs(['--logLevel', '4'])).parseAsync();
			expect(args.logLevel).toBe(LogLevel.WARN);
		});

		it('should parse erroneus values into the default', async () => {
			const args = await yargsForLogLevelOption(yargs(['--logLevel', '99'])).parseAsync();
			expect(args.logLevel).toBe(LogLevel.INFO);
		});
	});

	describe('--silent', () => {
		it('should imply logLevel OFF', async () => {
			const args = await yargsForLogLevelOption(yargs(['--silent'])).parseAsync();
			expect(args.logLevel).toBe(LogLevel.OFF);
		});
	});

	describe('--verbose', () => {
		it('should imply logLevel TRACE', async () => {
			const args = await yargsForLogLevelOption(yargs(['--verbose'])).parseAsync();
			expect(args.logLevel).toBe(LogLevel.TRACE);
		});
	});
});
