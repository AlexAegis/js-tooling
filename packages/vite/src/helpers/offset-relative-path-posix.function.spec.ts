import { describe, expect, it } from 'vitest';
import { offsetRelativePathPosix } from './offset-relative-path-posix.function.js';

describe('offsetRelativePathPosix', () => {
	it('should work on non-org packages', () => {
		expect(offsetRelativePathPosix('foo', 'bar')).toBe('./foo/bar');
	});

	it('should work on org packages', () => {
		expect(offsetRelativePathPosix('', '')).toBe('.');
	});
});
