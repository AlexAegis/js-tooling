import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfigWithDefaults } from './define-config-with-defaults.function.js';

export const svelteAppViteConfig = defineConfigWithDefaults({
	plugins: [svelte()],
	appType: 'spa',
});
