import { describe, expect, it } from 'vitest';
import { enterPathPosix } from './enter-path.function.js';

describe('enterPathPosix', () => {
	it('should remove the first folder', () => {
		expect(enterPathPosix('foo/bar/file')).toBe('bar/file');
	});

	it('should be able to enter multiple folders the first folder', () => {
		expect(enterPathPosix('foo/bar/file', 2)).toBe('file');
	});

	it('should be able to enter only folders folders the first folder', () => {
		expect(enterPathPosix('foo/bar/file', 10)).toBe('file');
	});

	it('should remove the first folder that is not .', () => {
		expect(enterPathPosix('./bar/file')).toBe('./file');
	});

	it('should remove nothing if it is just a filename', () => {
		expect(enterPathPosix('bar')).toBe('bar');
	});

	it('should remove everything if it is just a directory name', () => {
		expect(enterPathPosix('bar/')).toBe('.');
	});
});
