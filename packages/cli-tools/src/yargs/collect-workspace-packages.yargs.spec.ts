import { describe, expect, it } from 'vitest';
import yargs from 'yargs';
import { yargsForCollectWorkspacePackagesOptions } from './collect-workspace-packages.yargs.js';

describe('yargsForCollectWorkspacePackagesOptions', () => {
	it('should be able to extend an existing yargs object', async () => {
		const dependencyCriteria = ['foo', 'bar'];
		const yarguments = yargsForCollectWorkspacePackagesOptions(
			yargs(['--dependencyCriteria', ...dependencyCriteria]),
		);
		const args = await yarguments.parseAsync();

		expect(args.dependencyCriteria).toEqual(dependencyCriteria);
	});
});
