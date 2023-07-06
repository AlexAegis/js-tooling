import type { UserConfig } from 'vitest/config';
import { vitestCoverage } from './base-vitest.config.js';

export const vitestWebConfig = {
	plugins: [],
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: vitestCoverage,
	},
} satisfies UserConfig;
