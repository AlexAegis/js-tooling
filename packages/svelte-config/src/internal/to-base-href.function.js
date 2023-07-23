/**
 * A ts copy of this file exists at
 * packages/vite/src/helpers/to-base-href.function.ts
 */

/**
 * @param {string} path
 * @returns {path is import('./types.js').AbsolutePath}
 */
export const isAbsolute = (path) => {
	return path.startsWith('/');
};

/**
 * Normalizes a string that is either an empty string, or if not it
 * starts with a / but does not ends with one.
 *
 * The reason for this limitation is to let the base variable be trivially
 * joined with other paths like this: `${base}/foo`
 *
 * @param {string} path
 * @returns {import('./types.js').AbsolutePath | ''}
 */
export const toBaseHref = (path = '') => {
	const trimmed = path.replace(/\/$/, ''); // Must not end with '/'
	if (trimmed) {
		return isAbsolute(trimmed) ? trimmed : `/${trimmed}`;
	} else {
		return '';
	}
};
