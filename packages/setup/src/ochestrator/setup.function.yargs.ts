import { yargsForCwdOption, yargsForDryOption, yargsForForceOption } from '@alexaegis/cli-tools';
import type { LoggerOption } from '@alexaegis/logging';
import type { SetupOptions } from '@alexaegis/setup-plugin';
import type { Argv } from 'yargs';

export const yargsForSetup = <T>(
	yargs: Argv<T>
): Argv<T & Omit<SetupOptions, keyof LoggerOption>> => {
	return yargsForDryOption(yargsForForceOption(yargsForCwdOption(yargs))).option('dryish', {
		boolean: true,
		default: false,
		description:
			"Execute excutors, and trust them that they don't actually write anything to the disk",
	});
};
