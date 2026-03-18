import { getPrettierFormatter } from './get-prettier-formatter.function.js';
import type { PrettifyOptions } from './try-prettify.function.options.js';

/**
 *
 * @returns a prettified string if prettier is available, an untouched string
 * otherwise
 */
export const tryPrettify = async (content: string, options?: PrettifyOptions): Promise<string> => {
	const formatter = await getPrettierFormatter(options);
	return await formatter(content);
};
