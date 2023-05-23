import type { Config, Options } from 'prettier';
import prettierPluginSvelte from 'prettier-plugin-svelte';
import prettierPluginTailwind from 'prettier-plugin-tailwind';

// When making changes here, copy the setup to the root of this repository
// This repository should not use the autogenerated setup since that relies
// on this package and autotool-plugin-prettier being build. Which could break
// during development. And if formatting breaks it could lead to nasty things
// during build as autolib tries to format using prettier and if not available
// will mess up the package.json files after editing.
export default {
	plugins: [prettierPluginSvelte, prettierPluginTailwind],
	overrides: [
		{
			files: '*.svelte',
			options: {
				svelteStrictMode: true,
				svelteSortOrder: 'options-scripts-markup-styles',
			} as Options,
		},
	],
} satisfies Config;
