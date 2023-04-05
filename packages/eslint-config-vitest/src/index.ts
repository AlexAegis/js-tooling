import type { Linter } from 'eslint';

export default {
	rules: {
		'no-restricted-imports': [
			'error',
			{
				paths: ['node:test', 'test', 'chai', 'mocha', 'jest'], // Prevent imports from other test frameworks
			},
		],
	},
} as Linter.Config;
