import type { NormalizedCwdOption } from '@alexaegis/fs';
import type { Argv } from 'yargs';

export const yargsForCwdOption = <T>(yargs: Argv<T>): Argv<T & NormalizedCwdOption> => {
	return yargs.option('cwd', {
		string: true,
		default: process.cwd(),
		description:
			'Override the working-directy, with this you can pretend that the ' +
			'command was called in another directory',
	});
};
