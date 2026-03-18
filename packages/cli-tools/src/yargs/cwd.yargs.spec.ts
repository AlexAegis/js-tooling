import { describe, expect, it } from 'vitest';
import yargs from 'yargs';
import { yargsForCwdOption } from './cwd.yargs.js';

describe('yargsForCwdAtDefault', () => {
	it('should parse', async () => {
		const cwd = '/foo/bar';
		const yarguments = yargsForCwdOption(yargs(['--cwd', cwd]));
		const args = await yarguments.parseAsync();

		expect(args.cwd).toEqual(cwd);
	});
});
