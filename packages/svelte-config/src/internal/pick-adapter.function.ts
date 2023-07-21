import autoAdapter from '@sveltejs/adapter-auto';
import staticAdapter from '@sveltejs/adapter-static';
import vercelAdapter from '@sveltejs/adapter-vercel';
import type { Adapter } from '@sveltejs/kit';

export type Platform = 'vercel' | 'github-pages' | 'auto';

export const isPlatform = (platform: string | undefined): platform is Platform => {
	return platform === 'vercel' || platform === 'github-pages' || platform === 'auto';
};

export const normalizePlatform = (platform: string | undefined): Platform => {
	return isPlatform(platform) ? platform : 'auto';
};

export const pickAdapter = (platform: Platform = 'auto'): Adapter => {
	if (platform === 'github-pages') {
		return staticAdapter({
			fallback: 'index.html', // may differ from host to host
			strict: true,
			precompress: true,
		});
	} else if (platform === 'vercel') {
		return vercelAdapter({});
	} else {
		return autoAdapter();
	}
};
