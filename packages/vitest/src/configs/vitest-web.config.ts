import { defineConfig } from 'vitest/config';
import { vitestCoverage } from './base-vitest.config.js';

export const vitestWebConfig = defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: vitestCoverage,
	},
});
