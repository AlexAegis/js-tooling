import { vitePreprocess } from '@sveltejs/kit/vite';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess.js';
import { normalizePlatform, pickAdapter } from './pick-adapter.function.js';
import { toBaseHref } from './to-base-href.function.js';

/**
 * Adds the regular sveltePreprocessors
 *
 * @returns @type {import('./types.js').Config}
 */
export const libConfiguration = {
	preprocess: sveltePreprocess(),
};

/**
 * Enables the vite inspector on `shift`
 *
 * @returns @type {import('./types.js').Config}
 */
export const spaConfiguration = {
	...libConfiguration,
	vitePlugin: {
		inspector: {
			holdMode: true,
			toggleKeyCombo: 'shift',
		},
	},
};

/**
 * Enables the vite inspector on `shift`, overrides the regular svelte preprocessor with kit's
 * And sets the base href to the value of `process.env['BASE_HREF']`
 * And the platform based on `process.env['PLATFORM']`
 * Valid values are 'vercel', 'github-pages' and 'auto' which is the default
 *
 * @returns @type {import('./types.js').Config}
 */
export const kitConfiguration = {
	...spaConfiguration,
	preprocess: vitePreprocess(),
	kit: {
		paths: {
			base: toBaseHref(process.env['BASE_HREF']),
		},
		adapter: pickAdapter(normalizePlatform(process.env['PLATFORM'])),
	},
};
