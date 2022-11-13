import { defineConfig } from 'vitest/config';
import { vitestCoverage } from './base-vitest.config.js';

export const vitestNodeConfig = defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'node',
		coverage: vitestCoverage,
	},
});
