import type { ViteUserConfig } from 'vitest/config';
import type { CoverageOptions, CoverageReporter } from 'vitest/node';

const vitestReporters: CoverageReporter[] = ['text', 'json', 'html', 'lcov'];

const vitestCoverage: CoverageOptions = {
	provider: 'v8',
	reporter: vitestReporters,
	reportsDirectory: './coverage',
};

const vitestNodeConfig = {
	plugins: [],
	test: {
		globals: true,
		environment: 'node',
		coverage: vitestCoverage,
	},
} satisfies ViteUserConfig;

export default vitestNodeConfig;
