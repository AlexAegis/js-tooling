import { defineConfig } from 'vitest/config';

// This package can't use the config from /vitest becasue it would result
// in a circular dependency
export default defineConfig({
	plugins: [],
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'c8',
			all: true,
			include: ['src'],
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
		},
	},
});
