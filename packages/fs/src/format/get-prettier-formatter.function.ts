import type { Awaitable } from '@alexaegis/common';
import { join } from 'node:path';
import type { Options } from 'prettier';
import { normalizePrettifyOptions, type PrettifyOptions } from './try-prettify.function.options.js';

/**
 * @returns a function that formats strings with prettier
 */
export const getPrettierFormatter = async (
	rawOptions?: PrettifyOptions,
): Promise<(content: string) => Awaitable<string>> => {
	const options = normalizePrettifyOptions(rawOptions);

	try {
		const prettier = await import('prettier');

		// Prettier expects a file path (the one intended to be formatted), not
		// a directory path. So even if you have a file such as `/project/.prettierrc`
		// searching from `/project` will not find it.
		// The filename joined after cwd could be anything, it does not need to exist.
		const prettierConfig = await prettier.resolveConfig(join(options.cwd, '.prettierrc'), {
			editorconfig: true,
		});

		const prettierOptions: Options = {
			...prettierConfig,
			parser: options.parser,
		};

		return async (content) => {
			try {
				return await prettier.format(content, prettierOptions);
			} catch (error) {
				options.logger.error('prettier format failed', error);
				return content;
			}
		};
	} catch (error) {
		options.logger.warn('loading prettier failed', error);
		return (content) => content;
	}
};
