import type { UserConfig } from 'vitest/config';
import { vitestCoverage } from './base-vitest.config.js';

export const vitestNodeConfig = {
	plugins: [],
	test: {
		globals: true,
		environment: 'node',
		coverage: vitestCoverage,
	},
} satisfies UserConfig;
