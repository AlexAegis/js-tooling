// This file should be kept in sync with packages/prettier-config/src/index.ts
// As this file cannot use the auto distributed file like other repos will.

module.exports = {
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	plugins: ['prettier-plugin-svelte'],
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
		{
			files: '*.svelte',
			options: {
				svelteStrictMode: true,
				svelteSortOrder: 'options-scripts-markup-styles',
			},
		},
	],
};
