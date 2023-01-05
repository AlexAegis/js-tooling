import type { CoverageOptions, CoverageReporter } from 'vitest';

export const vitestReporters: CoverageReporter[] = ['text', 'json', 'html', 'lcov'];

// TODO: get workspace root for coverage dir
export const vitestCoverage: CoverageOptions = {
	provider: 'c8',
	reporter: vitestReporters,
	reportsDirectory: '../../coverage',
};
