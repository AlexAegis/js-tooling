import type { BuiltInParserName } from 'prettier';

export interface PrettifyOptions {
	/**
	 * @default 'json-stringify'
	 */
	parser?: BuiltInParserName;

	/**
	 * @default process.cwd()
	 */
	cwd?: string;
}

/**
 * @returns a prettified string if prettier is available, an untouched string
 * otherwise
 */
export const tryPrettify = async (content: string, options?: PrettifyOptions): Promise<string> => {
	try {
		const prettier = await import('prettier');
		const prettierConfig = await prettier.default.resolveConfig(options?.cwd ?? process.cwd());
		const formatted = prettier.default.format(content, {
			...prettierConfig,
			parser: options?.parser ?? 'json-stringify',
		});
		return formatted;
	} catch {
		return content;
	}
};
