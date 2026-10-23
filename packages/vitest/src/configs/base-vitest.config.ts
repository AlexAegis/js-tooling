import type { CoverageOptions, CoverageReporter } from 'vitest/node';

export const vitestReporters: CoverageReporter[] = ['text', 'json', 'html', 'lcov'];

export const vitestCoverage: CoverageOptions = {
	provider: 'v8',
	reporter: vitestReporters,
	reportsDirectory: './coverage',
};

/**
 * Per-package module cache. vitest removes its default cache in the workspace root
 * when the lockfile hash changes. Packages tested in parallel would then remove
 * the cache while another package uses it.
 */
export const vitestFsModuleCachePath = 'node_modules/.vitest-cache';
