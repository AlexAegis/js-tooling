import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { mergeConfig } from 'vitest/config';
import { vitestWebConfig } from './vitest-web.config.js';

/**
 * This vitest config contains the svelte plugin from @sveltejs/vite-plugin-svelte
 * and the svelteTesting plugin from @testing-library/svelte/vite
 */
export const vitestSvelteConfig = mergeConfig(vitestWebConfig, {
	plugins: [svelte({ hot: !process.env['VITEST'] }), svelteTesting()],
});
