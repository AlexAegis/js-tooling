import baseConfig from '@alexaegis/prettier-config';
import type { Config, Options } from 'prettier';
import prettierPluginSvelte from 'prettier-plugin-svelte';

// import prettierPluginTailwind from 'prettier-plugin-tailwind'; // TODO: Unusable until https://github.com/tailwindlabs/prettier-plugin-tailwindcss/issues/165

export default {
	...baseConfig,
	plugins: [...baseConfig.plugins, prettierPluginSvelte],
	overrides: [
		...baseConfig.overrides,
		{
			files: '*.svelte',
			options: {
				svelteStrictMode: true,
				svelteSortOrder: 'options-scripts-markup-styles',
			} as Options,
		},
	],
	// tailwindConfig: './tailwind.config.js',
} as Config;
