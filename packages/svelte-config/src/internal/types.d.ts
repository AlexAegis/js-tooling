export type { Adapter, Config as SvelteConfig } from '@sveltejs/kit';

export type Config = SvelteConfig;
export type Platform = 'vercel' | 'github-pages' | 'auto';
export type AbsolutePath = `/${string}`;
