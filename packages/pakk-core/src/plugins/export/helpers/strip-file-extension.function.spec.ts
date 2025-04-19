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

	it('should not remove anything beyond the last extension portion', () => {
		expect(stripFileExtension('/bar/foo.config.js')).toBe('/bar/foo.config');
	});

	describe('dts files', () => {
		it('should also remove the d in the special case of a d.ts file', () => {
			expect(stripFileExtension('/bar/foo.config.d.ts')).toBe('/bar/foo.config');
		});

		it('should not remove the d from a d.ts file if not allowed', () => {
			expect(stripFileExtension('/bar/foo.config.d.ts', { stripDts: false })).toBe(
				'/bar/foo.config.d',
			);
		});
	});
});
