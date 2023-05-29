import type { Config, Options } from 'prettier';
import prettierPluginSvelte from 'prettier-plugin-svelte';

export const prettierConfigSvelte = {
	plugins: [prettierPluginSvelte],
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
