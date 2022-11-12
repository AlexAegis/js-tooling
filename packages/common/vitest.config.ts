import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'c8',
			reporter: ['text', 'json', 'html', 'lcov'],
		},
	},
});
