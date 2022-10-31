import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, mergeConfig } from 'vite';
import { baseViteConfig } from './base-vite.config.js';

export const svelteViteConfig = mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [svelte()],
		appType: 'spa',
	})
);
