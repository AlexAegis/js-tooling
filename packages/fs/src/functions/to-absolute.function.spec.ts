import { describe, expect, it } from 'vitest';
import { toAbsolute } from './to-absolute.function.js';

describe('toAbsolute', () => {
	const mockCwd = '/foo';
	const mockRelativePath = 'bar';
	const mockAbsolutePath = '/foo/bar';

	it('should leave already absolute paths as is', () => {
		expect(toAbsolute(mockAbsolutePath)).toEqual(mockAbsolutePath);
	});

	it('should turn relative paths to absolute based on cwd', () => {
		expect(
			toAbsolute(mockRelativePath, {
				cwd: mockCwd,
			}),
		).toEqual(mockAbsolutePath);
	});
});
