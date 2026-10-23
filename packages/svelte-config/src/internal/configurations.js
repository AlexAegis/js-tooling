import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { default as defaultSveltePreprocess, sveltePreprocess } from 'svelte-preprocess';
import { normalizePlatform, pickAdapter } from './pick-adapter.function.js';
import { toBaseHref } from './to-base-href.function.js';

const preprocess = sveltePreprocess ?? defaultSveltePreprocess;

/**
 * Adds the regular sveltePreprocessors
 *
 * @type {import('./types.js').Config}
 */
export const libConfiguration = {
	preprocess: preprocess(),
};

/**
 * @type {import('@sveltejs/vite-plugin-svelte').PluginOptions['inspector']}
 */
const inspector = {
	holdMode: true,
	toggleKeyCombo: 'shift',
};

/**
 * Enables the vite inspector on `shift`
 *
 * @type {import('./types.js').Config}
 */
export const spaConfiguration = {
	...libConfiguration,
	vitePlugin: {
		inspector,
	},
};

/**
 * Options for the `sveltekit()` vite plugin. SvelteKit does not read
 * `svelte.config.js`.
 *
 * - Enables the vite inspector on `shift`
 * - Uses `vitePreprocess` as the svelte preprocessor
 * - Sets the base href to the value of `process.env['BASE_HREF']`
 * - Picks the adapter based on `process.env['PLATFORM']`. Valid values are
 *   'vercel', 'node', 'github-pages' and 'auto', which is the default
 *
 * @type {import('./types.js').KitConfig}
 */
export const kitConfiguration = {
	preprocess: vitePreprocess(),
	inspector,
	paths: {
		base: toBaseHref(process.env['BASE_HREF']),
	},
	adapter: pickAdapter(normalizePlatform(process.env['PLATFORM'])),
};
