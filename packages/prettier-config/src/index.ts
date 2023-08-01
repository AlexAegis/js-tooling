import type { Config, Options } from 'prettier';
import prettierPluginSvelte from 'prettier-plugin-svelte';
import prettierPluginTailwindcss from 'prettier-plugin-tailwindcss';

// The prettier VS Code extension doesn't really care about configs deeper in
// the project structure, so the root config has to deal with everything
export const prettierConfig = {
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	plugins: [prettierPluginSvelte, prettierPluginTailwindcss],
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
		{
			files: '*.svelte',
			options: {
				parser: 'svelte',
				svelteStrictMode: true,
				svelteSortOrder: 'options-scripts-markup-styles',
			} as Options,
		},
	],
} satisfies Config;

export default prettierConfig;
