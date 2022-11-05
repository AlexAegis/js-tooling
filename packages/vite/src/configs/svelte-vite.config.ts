import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, mergeConfig } from 'vite';
import { DEFAULT_VITE_CONFIG } from './base-vite.config.js';

export const svelteViteConfig = mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		plugins: [svelte()],
		appType: 'spa',
	})
);
