import { join } from 'node:path/posix';
import { describe, expect, it, vi } from 'vitest';
import { findNearestFile } from './find-nearest-file.function.js';

vi.mock('node:fs', () => {
	return {
		existsSync: vi.fn((path: string) =>
			[
				join('foo'),
				join('foo', 'zed'),
				join('foo', 'bar'),
				join('foo', 'package.json'),
				join('/foo'),
				join('/foo', 'zed'),
				join('/foo', 'bar'),
				join('/foo', 'package.json'),
			].includes(path),
		),
	};
});

describe('findNearestFile', () => {
	const fileName = 'package.json';
	it('should find a file immediately in the search path', () => {
		expect(findNearestFile(fileName, 'foo')).toEqual('foo');
	});

	it('should find a file a few folders out', () => {
		expect(findNearestFile(fileName, join('foo', 'bar', 'ger'))).toEqual('foo');
	});

	it('should be able to find files at the root too', () => {
		expect(findNearestFile('nonexistent', join('/foo', 'bar'))).toBeUndefined();
	});

	it('should return nothing when there is nothing to fid', () => {
		expect(findNearestFile('nonexistent', join('/foo', 'bar'))).toBeUndefined();
	});
});
