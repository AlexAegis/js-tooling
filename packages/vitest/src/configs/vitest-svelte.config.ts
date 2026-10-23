import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { mergeConfig } from 'vitest/config';
import { vitestWebConfig } from './vitest-web.config.js';

/**
 * This vitest config contains the svelte plugin from @sveltejs/vite-plugin-svelte
 * and the svelteTesting plugin from @testing-library/svelte/vite
 */
export const vitestSvelteConfig = mergeConfig(vitestWebConfig, {
	plugins: [svelte(), svelteTesting()],
});

/**
 * The vitest config for SvelteKit apps. SvelteKit apps have no
 * `svelte.config.js` to read the preprocessor from, so this config sets the
 * same preprocessor as `kitConfiguration` in `@alexaegis/svelte-config`.
 */
export const vitestSvelteKitConfig = mergeConfig(vitestWebConfig, {
	plugins: [svelte({ configFile: false, preprocess: vitePreprocess() }), svelteTesting()],
});
