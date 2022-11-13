import type { CoverageOptions, CoverageReporter } from 'vitest';

export const vitestReporters: CoverageReporter[] = ['text', 'json', 'html', 'lcov'];

export const vitestCoverage: CoverageOptions = {
	provider: 'c8',
	reporter: vitestReporters,
};
