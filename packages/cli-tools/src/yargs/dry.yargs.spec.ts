import { describe, expect, it } from 'vitest';
import yargs from 'yargs';
import { yargsForDryOption } from './dry.yargs.js';

describe('yargsForDryOption', () => {
	it('should parse', async () => {
		const dryness = true;
		const yarguments = yargsForDryOption(yargs(['--dry', Boolean(dryness).toString()]));
		const args = await yarguments.parseAsync();

		expect(args.dry).toEqual(dryness);
	});
});
