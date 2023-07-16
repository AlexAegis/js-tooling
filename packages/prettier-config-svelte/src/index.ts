import type { Config, Options } from 'prettier';
//import prettierPluginSvelte from 'prettier-plugin-svelte';
// TODO: re-enable once prettier-plugin-svelte is released with prettierv3 support https://github.com/sveltejs/prettier-plugin-svelte/pull/335
// TODO: if this isn't solved https://github.com/remcohaszing/unified-prettier/issues/1 import it as a string and not as an object
export const prettierConfigSvelte = {
	plugins: [
		/*prettierPluginSvelte OR 'prettier-plugin-svelte'*/
	],
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
