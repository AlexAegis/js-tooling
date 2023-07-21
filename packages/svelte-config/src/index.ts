import type { Config as SvelteConfig } from '@sveltejs/kit';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess.js';
import { normalizePlatform, pickAdapter } from './internal/pick-adapter.function.js';
import { toBaseHref } from './internal/to-base-href.function.js';

export * from './internal/pick-adapter.function.js';
export * from './internal/to-base-href.function.js';

export type Config = SvelteConfig;

/**
 * Adds the regular sveltePreprocessors
 */
export const libConfiguration: Config = {
	preprocess: sveltePreprocess(),
};

/**
 * Enables the vite inspector on `shift`
 */
export const spaConfiguration: Config = {
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
 */
export const kitConfiguration: Config = {
	...spaConfiguration,
	preprocess: vitePreprocess(),
	kit: {
		paths: {
			base: toBaseHref(process.env['BASE_HREF']),
		},
		adapter: pickAdapter(normalizePlatform(process.env['PLATFORM'])),
	},
};
