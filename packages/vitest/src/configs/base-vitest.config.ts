import type { CoverageOptions, CoverageReporter } from 'vitest';

export const vitestReporters: CoverageReporter[] = ['text', 'json', 'html', 'lcov'];

export const vitestCoverage: CoverageOptions = {
	provider: 'v8',
	reporter: vitestReporters,
	reportsDirectory: './coverage',
};
