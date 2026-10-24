import type { Config, Options } from 'prettier';

// typed as Options so that overrides can take any options
const svelteOverrideOptions: Options = {
	parser: 'svelte',
	svelteSortOrder: 'options-scripts-markup-styles',
};

// The prettier VS Code extension doesn't really care about configs deeper in
// the project structure, so the root config has to deal with everything
export const prettierConfig = {
	tabWidth: 4,
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
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
			options: svelteOverrideOptions,
		},
	],
} satisfies Config;

export default prettierConfig;
