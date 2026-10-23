import type { ViteUserConfig } from 'vitest/config';
import { vitestCoverage, vitestFsModuleCachePath } from './base-vitest.config.js';

export const vitestNodeConfig = {
	plugins: [],
	test: {
		globals: true,
		environment: 'node',
		coverage: vitestCoverage,
		fsModuleCachePath: vitestFsModuleCachePath,
	},
} satisfies ViteUserConfig;
