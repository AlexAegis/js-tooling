import type { Config, Options } from 'prettier';

export const prettierConfigSvelte = {
	plugins: ['prettier-plugin-svelte'],
	overrides: [
		{
			files: '*.svelte',
			options: {
				svelteStrictMode: true,
				svelteSortOrder: 'options-scripts-markup-styles',
			} as Options,
		},
	],
} as Config;

export default prettierConfigSvelte;
