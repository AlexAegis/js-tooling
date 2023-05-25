// This file should be kept in sync with packages/prettier-config/src/index.ts
// As this file cannot use the auto distributed file like other repos would.
// During build, prettier is used to format package.json files, but at the
// start of build, prettier-config's dist dir is deleted, leaving the config
// invalid.

module.exports = {
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	overrides: [
		{
			files: '*.{md,yml,yaml}',
			options: {
				tabWidth: 2,
				useTabs: false,
				printWidth: 80,
				proseWrap: 'always',
			},
		},
		{
			files: '*.{py}',
			options: {
				useTabs: false,
				printWidth: 80,
			},
		},
	],
};
