import type { Adapter as SvelteAdapter, Config as SvelteConfig } from '@sveltejs/kit';

export type Adapter = SvelteAdapter;
export type Config = SvelteConfig;
export type Platform = 'vercel' | 'node' | 'github-pages' | 'auto';
export type AbsolutePath = `/${string}`;
