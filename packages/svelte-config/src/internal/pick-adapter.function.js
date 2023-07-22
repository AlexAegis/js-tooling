import autoAdapter from '@sveltejs/adapter-auto';
import staticAdapter from '@sveltejs/adapter-static';
import vercelAdapter from '@sveltejs/adapter-vercel';

/**
 * @type {import('./pick-adapter.function.js').isPlatform}
 */
export const isPlatform = (platform) => {
	return platform === 'vercel' || platform === 'github-pages' || platform === 'auto';
};

/**
 * @type {import('./pick-adapter.function.js').normalizePlatform}
 */
export const normalizePlatform = (platform) => {
	return isPlatform(platform) ? platform : 'auto';
};

/**
 * @type {import('./pick-adapter.function.js').pickAdapter}
 */
export const pickAdapter = (platform = 'auto') => {
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
