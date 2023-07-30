import autoAdapter from '@sveltejs/adapter-auto';
import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';
import vercelAdapter from '@sveltejs/adapter-vercel';

/**
 * @param {string | undefined} platform
 * @returns {platform is import('./types.js').Platform}
 */
export const isPlatform = (platform) => {
	return (
		platform === 'vercel' ||
		platform === 'node' ||
		platform === 'github-pages' ||
		platform === 'auto'
	);
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
	switch (platform) {
		case 'github-pages': {
			return staticAdapter({
				fallback: 'index.html', // may differ from host to host
				strict: true,
				precompress: true,
			});
		}
		case 'vercel': {
			return vercelAdapter({});
		}
		case 'node': {
			return nodeAdapter({
				precompress: true,
			});
		}
		default: {
			return autoAdapter();
		}
	}
};
