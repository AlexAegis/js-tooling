import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import defaultSveltePreprocess, { sveltePreprocess } from 'svelte-preprocess';
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
 * Options for the `sveltekit()` vite plugin (SvelteKit 3 does not read `svelte.config.js`):
 * - vite inspector on `shift`
 * - `vitePreprocess` as the preprocessor
 * - base href from `process.env['BASE_HREF']`
 * - adapter from `process.env['PLATFORM']`: 'vercel', 'node', 'github-pages' or 'auto' (default)
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
