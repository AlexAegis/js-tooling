/*
import { svelteAppViteConfig } from '@alexaegis/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(svelteAppViteConfig, defineConfig({ plugins: [sveltekit()] }));
asd
*/
import { DEFAULT_VITE_CONFIG } from '@alexaegis/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(DEFAULT_VITE_CONFIG, {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
});
