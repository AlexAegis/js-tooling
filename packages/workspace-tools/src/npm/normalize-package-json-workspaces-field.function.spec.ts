import { describe, expect, it } from 'vitest';
import { normalizePackageJsonWorkspacesField } from './normalize-package-json-workspaces-field.function.js';

describe('normalizePackageJsonWorkspacesField', () => {
	it('should leave arrays as is', () => {
		const array = ['foo'];
		const normalized = normalizePackageJsonWorkspacesField(array);
		expect(normalized).toBe(array);
	});

	it('should collect entries from packages and nohoist', () => {
		const packages = ['foo'];
		const nohoist = ['bar'];
		const normalized = normalizePackageJsonWorkspacesField({ packages, nohoist });
		expect(normalized).toEqual([...packages, ...nohoist]);
	});

	it('should collect entries from packages alone', () => {
		const packages = ['foo'];
		const normalized = normalizePackageJsonWorkspacesField({ packages });
		expect(normalized).toEqual([...packages]);
	});

	it('should collect entries from nohoist alone', () => {
		const nohoist = ['foo'];
		const normalized = normalizePackageJsonWorkspacesField({ nohoist });
		expect(normalized).toEqual([...nohoist]);
	});

	it('should return an empty array when the field does not exist', () => {
		const normalized = normalizePackageJsonWorkspacesField();
		expect(normalized).toEqual([]);
	});
});
