import { vitestCoverage } from './base-vitest.config.js';

export const vitestWebConfig = {
	plugins: [],
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		globals: true,
		environment: 'jsdom',
		coverage: vitestCoverage,
	},
};
