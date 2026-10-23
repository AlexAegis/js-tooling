import type { Adapter as SvelteAdapter } from '@sveltejs/kit';
import type { Config as SvelteKitConfig } from '@sveltejs/kit/vite';
import type { SvelteConfig } from '@sveltejs/vite-plugin-svelte';

export type Adapter = SvelteAdapter;
/**
 * The contents of a `svelte.config.js` file
 */
export type Config = SvelteConfig;
/**
 * The options of the `sveltekit()` vite plugin
 */
export type KitConfig = SvelteKitConfig;
export type Platform = 'vercel' | 'node' | 'github-pages' | 'auto';
export type AbsolutePath = `/${string}`;
