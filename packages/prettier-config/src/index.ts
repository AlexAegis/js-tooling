/**
 * @type {import('prettier').Config}
 */
export default {
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
}
