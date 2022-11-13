import { defineConfig } from 'vitest/config';
import { vitestCoverage } from './base-vitest.config.js';

export const vitestDomConfig = defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: vitestCoverage,
	},
});
