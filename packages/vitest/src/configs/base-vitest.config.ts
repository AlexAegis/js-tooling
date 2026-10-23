import type { CoverageOptions, CoverageReporter } from 'vitest/node';

export const vitestReporters: CoverageReporter[] = ['text', 'json', 'html', 'lcov'];

export const vitestCoverage: CoverageOptions = {
	provider: 'v8',
	reporter: vitestReporters,
	reportsDirectory: './coverage',
};

/**
 * By default vitest keeps its module cache in the node_modules of the
 * workspace root and removes it when the lockfile changes. Packages tested
 * in parallel would remove it under each other, so each package gets its own.
 */
export const vitestFsModuleCachePath = 'node_modules/.vitest-cache';
