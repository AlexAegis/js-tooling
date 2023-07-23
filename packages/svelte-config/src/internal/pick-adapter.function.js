import autoAdapter from '@sveltejs/adapter-auto';
import staticAdapter from '@sveltejs/adapter-static';
import vercelAdapter from '@sveltejs/adapter-vercel';

/**
 * @param {string | undefined} platform
 * @returns {platform is import('./types.js').Platform}
 */
export const isPlatform = (platform) => {
	return platform === 'vercel' || platform === 'github-pages' || platform === 'auto';
};

/**
 * @param {string | undefined} platform
 * @returns {import('./types.js').Platform}
 */
export const normalizePlatform = (platform) => {
	return isPlatform(platform) ? platform : 'auto';
};

/**
 * @param {string | undefined} platform
 * @returns {import('./types.js').Adapter}
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
