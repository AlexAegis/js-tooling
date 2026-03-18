import { HASH_COMMENT, NEWLINE } from '@alexaegis/fs';

/**
 * Strips out comments from lines, returns the then non-empty lines.
 * It is meant for ignore files like `.gitignore` but all it does is split
 * a string line by line and strip hash comments off so the name is more
 * generic too
 *
 * @param content content of a file like .gitignore
 *
 * @example a file like
 *
 * ```gitignore
 *		foo
 *		bar
 *
 *		# comment
 *
 *
 *		zed # comment
 *		#
 * ```
 *
 * will be parsed as ['foo', 'bar', 'zed'] by this function
 */
export const splitAndStripHashComments = (content: string): string[] => {
	return content
		.split(NEWLINE)
		.map((line) => line.replace(HASH_COMMENT, '').trim())
		.filter((line) => !!line);
};
