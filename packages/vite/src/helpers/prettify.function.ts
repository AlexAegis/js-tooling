import type { BuiltInParserName } from 'prettier';

/**
 * While this function would certainly make more sense to be in the prettier
 * package, it is used earliest here
 * @param rawFile
 * @param parser
 * @param cwd
 * @returns
 */
export const prettify = async (
	rawFile: string,
	parser: BuiltInParserName = 'json-stringify',
	cwd = process.cwd()
): Promise<string> => {
	const prettier = await import('prettier');
	const prettierConfig = await prettier.default.resolveConfig(cwd);
	const formatted = prettier.default.format(rawFile, {
		...prettierConfig,
		parser,
	});
	return formatted;
};
