import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mergeConfig } from 'vitest/config';
import { vitestWebConfig } from './vitest-web.config.js';

export const vitestSvelteConfig = mergeConfig(vitestWebConfig, {
	plugins: [svelte({ hot: !process.env['VITEST'] })],
});
