import type { LoggerOption } from '@alexaegis/logging';
import type { CollectWorkspacePackagesOptions } from '@alexaegis/workspace-tools';
import type { Argv } from 'yargs';
import { yargsForCwdOption } from './cwd.yargs.js';
import { yargsForDryOption } from './dry.yargs.js';
import { yargsForForceOption } from './force.yargs.js';

export const yargsForCollectWorkspacePackagesOptions = <T>(
	yargs: Argv<T>,
): Argv<T & Omit<CollectWorkspacePackagesOptions, keyof LoggerOption>> => {
	return yargsForDryOption(yargsForForceOption(yargsForCwdOption(yargs)))
		.option('skipWorkspaceRoot', {
			boolean: true,
			default: false,
			description: "Don't act on the root of the workspace",
		})
		.option('onlyWorkspaceRoot', {
			boolean: true,
			default: false,
			description: 'Only act on to the root of the workspace.',
		})
		.option('dependencyCriteria', {
			default: [],
			array: true,
			string: true,
			description:
				'Only act on packages that have these dependencies or devDependencies listed ' +
				'in their package.json file. Empty means no such filtering is applied.',
		});
};
