/**
 * A plain js copy of this file exists at
 * packages/svelte-config/src/internal/to-base-href.function.js
 */

export type AbsolutePath = `/${string}`;

export const isAbsolute = (path: string): path is AbsolutePath => {
	return path.startsWith('/');
};

/**
 * Normalizes a string that is either an empty string, or if not it
 * starts with a / but does not ends with one.
 *
 * The reason for this limitation is to let the base variable be trivially
 * joined with other paths like this: `${base}/foo`
 */
export const toBaseHref = (path = ''): AbsolutePath | '' => {
	const trimmed = path.replace(/\/$/, ''); // Must not end with '/'
	if (trimmed) {
		return isAbsolute(trimmed) ? trimmed : `/${trimmed}`;
	} else {
		return '';
	}
};
