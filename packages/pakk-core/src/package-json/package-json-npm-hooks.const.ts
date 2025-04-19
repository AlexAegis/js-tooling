/**
 * The hooks pnpm too will use.
 */
export const NPM_INSTALL_HOOKS = [
	'preinstall',
	'install',
	'postinstall',
	'prepublish',
	'preprepare',
	'prepare',
	'postprepare',
];

/**
 * From https://docs.npmjs.com/cli/v8/using-npm/scripts
 * And anything that start pre- and post- that also matches a user defined
 * script (prebuild and postbuild works if 'build' exists)
 */
export const ALL_NPM_HOOKS = [
	...NPM_INSTALL_HOOKS,
	'prepare',
	'prepack',
	'postpack',
	'prepublishOnly',
	'publish',
	'postpublish',
	'prerestart',
	'restart',
	'postrestart',
];
