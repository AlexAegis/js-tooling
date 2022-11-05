import { describe, expect, it } from 'vitest';
import { stripFileExtension } from './strip-file-extension.function.js';
describe('stripFileExtension', () => {
	it('should remove the extension from the end of a filename', () => {
		expect(stripFileExtension('foo.js')).toBe('foo');
	});

	it("should just return the filename if it doesn't have an extension", () => {
		expect(stripFileExtension('foo')).toBe('foo');
	});

	it('should just remove extension names, leaving paths alone', () => {
		expect(stripFileExtension('/bar/foo.js')).toBe('/bar/foo');
	});
});
