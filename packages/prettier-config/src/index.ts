import type { Config, Options } from 'prettier';

export default {
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	plugins: [],
	overrides: [
		{
			files: '*.{md,yml,yaml}',
			options: {
				tabWidth: 2,
				useTabs: false,
				printWidth: 80,
				proseWrap: 'always',
			} satisfies Options,
		},
		{
			files: '*.{py}',
			options: {
				useTabs: false,
				printWidth: 80,
			} satisfies Options,
		},
	],
} satisfies Config;
