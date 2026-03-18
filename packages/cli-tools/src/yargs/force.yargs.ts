import type { NormalizedForceOption } from '@alexaegis/common';
import type { Argv } from 'yargs';

export const yargsForForceOption = <T>(yargs: Argv<T>): Argv<T & NormalizedForceOption> => {
	return yargs.option('force', {
		boolean: true,
		default: false,
		description:
			'Disables many safety checks. It can write forcefully, ' +
			'even if that could result in data-loss!',
	});
};
