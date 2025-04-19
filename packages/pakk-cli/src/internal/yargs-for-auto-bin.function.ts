import {
	ALL_NPM_HOOKS,
	DEFAULT_BINSHIM_DIR,
	DEFAULT_BIN_DIR,
	DEFAULT_BIN_GLOB,
	DEFAULT_PACKAGE_EXPORT_IGNORES,
} from '@pakk/core';
import type { Argv } from 'yargs';

export const yargsForAutoBin = (yargs: Argv<unknown>): Argv<unknown> => {
	return yargs
		.group(
			['bins', 'binIgnore', 'defaultBinIgnore', 'binBaseDir', 'enabledNpmHooks', 'shimDir'],
			'auto-bin',
		)
		.option('bins', {
			description:
				'The files to treat as bins elative from the `srcDir + binBaseDir` directory.',
			string: true,
			array: true,
			default: DEFAULT_BIN_GLOB,
		})
		.option('binIgnore', {
			description:
				'What paths to ignore when collecting bins in addition to `defaultBinIgnore` so ' +
				"you're not dropping the defaults when you just want to add additional ignore " +
				'entries.',
			string: true,
			array: true,
			default: [],
		})
		.option('defaultBinIgnore', {
			description: 'By default test files are excluded',
			string: true,
			array: true,
			default: DEFAULT_PACKAGE_EXPORT_IGNORES,
		})
		.option('binBaseDir', {
			description:
				'Relative path from `srcDir` if you want your exports to start from a different ' +
				'directory.',
			string: true,
			default: DEFAULT_BIN_DIR,
		})
		.option('enabledNpmHooks', {
			description:
				"If a bin's name matches with an entry here (which is by default every " +
				"NPM hook, 'postinstall' 'prebuild' etc.) then it will be automatically " +
				"added to your packageJson file's scripts. To not interfere with " +
				'development, hooks invoked during install are disabled for the source ' +
				'packageJson and are only avilable in the distributed packageJson.',
			string: true,
			array: true,
			default: ALL_NPM_HOOKS,
		})
		.option('shimDir', {
			description: 'A directory where shims for the built bins would be placed.',
			string: true,
			default: DEFAULT_BINSHIM_DIR,
		});
};
