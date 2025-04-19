import { describe, expect, it } from 'vitest';
import {
	normalizeAutoSortPackageJsonOptions,
	type AutoSortPackageJsonOptions,
} from './auto-sort-package-json.class.options.js';

describe('normalizeAutoSortPackageJsonOptions', () => {
	it('returns the default options if no options was set', () => {
		const normalizedOptions = normalizeAutoSortPackageJsonOptions();
		expect(normalizedOptions).toEqual({
			sortingPreference: undefined,
			cwd: process.cwd(),
		} as AutoSortPackageJsonOptions);
	});

	it('should autofix exports ordering if its not even present', () => {
		const normalizedOptions = normalizeAutoSortPackageJsonOptions({
			sortingPreference: ['name'],
			cwd: '/foo',
		});
		expect(normalizedOptions).toEqual({
			sortingPreference: ['name'],
			cwd: '/foo',
		} as AutoSortPackageJsonOptions);
	});

	it('should autofix exports ordering if its present as a string', () => {
		const normalizedOptions = normalizeAutoSortPackageJsonOptions({
			sortingPreference: ['name', 'exports'],
			cwd: '/foo',
		});
		expect(normalizedOptions).toEqual({
			sortingPreference: ['name', 'exports'],
			cwd: '/foo',
		} as AutoSortPackageJsonOptions);
	});
});
