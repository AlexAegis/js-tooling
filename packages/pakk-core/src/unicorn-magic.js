import { fileURLToPath } from 'node:url';

/**
 *
 * @param {string | URL} urlOrPath
 * @returns {string}
 */
export function toPath(urlOrPath) {
	return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
}
