import type { Config, Options } from 'prettier';
import prettierPluginSvelte from 'prettier-plugin-svelte';

// When making changes here, copy the setup to the root of this repository
// This repository should not use the autogenerated setup since that relies
// on this package and autotool-plugin-prettier being build. Which could break
// during development. And if formatting breaks it could lead to nasty things
// during build as autolib tries to format using prettier and if not available
// will mess up the package.json files after editing.
export default {
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	plugins: [prettierPluginSvelte],
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
			} as Options,
		},
	],
} satisfies Config;
