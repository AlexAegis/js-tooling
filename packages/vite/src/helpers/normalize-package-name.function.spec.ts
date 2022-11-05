import { describe, expect, it } from 'vitest';
import { normalizePackageName } from './normalize-package-name.function.js';
describe('normalizePackageName', () => {
	it('should work on non-org packages', () => {
		expect(normalizePackageName('bar')).toBe('bar');
	});

	it('should work on org packages', () => {
		expect(normalizePackageName('@foo/bar')).toBe('foo-bar');
	});
});
