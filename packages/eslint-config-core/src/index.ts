import type { Linter } from 'eslint';

export default {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended', // 'eslint:all'
		'plugin:unicorn/recommended', // 'plugin:unicorn/all'
		'prettier',
	],
	// The first entry here throws away all ignores coming from other configs
	ignorePatterns: ['!**/*', 'node_modules', 'dist', 'coverage', '.turbo', 'tmp', 'shims'],
	overrides: [
		{
			files: ['*.{ts,js,cts,cjs,mts,mjs,tsx,jsx,svelte}'],
			rules: {
				quotes: ['error', 'single', { avoidEscape: true }],
			},
		},
		{
			files: ['*.ts', '*.svelte'],
			plugins: ['@typescript-eslint'],
			extends: [
				'plugin:@typescript-eslint/recommended', // 'plugin:@typescript-eslint/all',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:@typescript-eslint/strict',
			],
			rules: {
				'@typescript-eslint/no-invalid-void-type': [
					'error',
					{
						allowInGenericTypeArguments: true,
						allowAsThisParameter: true,
					},
				],
			},
		},
		{
			files: ['*.svelte'],
			plugins: ['svelte3', '@typescript-eslint'],
			processor: 'svelte3/svelte3',
			settings: {
				'svelte3/typescript': true,
			},
		},
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
	},
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'unicorn/no-array-reduce': 'off',
		'unicorn/no-array-callback-reference': 'off', // needed for easy nullish checks
		'unicorn/prevent-abbreviations': 'off', // no thanks
		'unicorn/prefer-top-level-await': 'off', // Until ES2022 is used as target
		'unicorn/no-useless-undefined': 'off', // for .catch(() => undefined)
		'unicorn/no-for-loop': 'off', // Seriously?
	},
} as Linter.Config;
