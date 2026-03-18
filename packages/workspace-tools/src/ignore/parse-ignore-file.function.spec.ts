import { describe, expect, it } from 'vitest';
import { splitAndStripHashComments } from './parse-ignore-file.function.js';

describe('parseIgnoreFile', () => {
	it('should be able to parse a single line file too', () => {
		const result = splitAndStripHashComments('foo');
		expect(result).toEqual(['foo']);
	});

	it('should strip out comments and newlines from an ignore files content', () => {
		const result = splitAndStripHashComments(`
		foo
		bar

		# comment


		zed # comment
		#`);
		expect(result).toEqual(['foo', 'bar', 'zed']);
	});

	it('should return an empty array for a file with only comments', () => {
		const result = splitAndStripHashComments('# foo');
		expect(result).toEqual([]);
	});
});
