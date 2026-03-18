import type { NormalizedDryOption } from '@alexaegis/common';
import type { Argv } from 'yargs';

export const yargsForDryOption = <T>(yargs: Argv<T>): Argv<T & NormalizedDryOption> => {
	return yargs.option('dry', {
		boolean: true,
		default: false,
		description: "Don't actually do anything just log",
	});
};
