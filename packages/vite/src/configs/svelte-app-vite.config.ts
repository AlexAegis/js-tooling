import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineAppConfig } from './define-config-with-defaults.function.js';

export const svelteAppViteConfig = defineAppConfig({
	plugins: [svelte()],
	appType: 'spa',
});
