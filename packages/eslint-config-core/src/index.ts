import type { Linter } from 'eslint';

export default {
	extends: [
		'eslint:recommended', // 'eslint:all'
		'plugin:unicorn/recommended', // 'plugin:unicorn/all'
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	// The first entry here throws away all ignores coming from other configs
	ignorePatterns: ['!**/*', 'node_modules', 'dist', 'coverage', '.turbo', 'tmp', 'shims'],
	overrides: [
		{
			files: ['*.{ts,js,cts,cjs,mts,mjs,tsx,jsx}'],
			rules: {
				quotes: ['error', 'single', { avoidEscape: true }],
			},
		},
		{
			files: ['*.{ts,tsx}'],
			plugins: ['@typescript-eslint'],
			parserOptions: {
				project: true, // For @typescript-eslint
			},
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-type-checked',
				'plugin:@typescript-eslint/strict',
				'plugin:@typescript-eslint/strict-type-checked',
				'plugin:@typescript-eslint/stylistic',
				'plugin:@typescript-eslint/stylistic-type-checked',
			],
			rules: {
				'@typescript-eslint/no-invalid-void-type': [
					'error',
					{
						allowInGenericTypeArguments: true,
						allowAsThisParameter: true,
					},
				],
				'@typescript-eslint/restrict-template-expressions': [
					'error',
					{
						allowBoolean: true,
						allowNumber: true,
					},
				],
			},
		},
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
		extraFileExtensions: ['.json'],
	},
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	rules: {
		'no-unused-vars': 'off', // Letting @typescript-eslint/no-unused-vars take helm
		'prefer-const': ['error', { destructuring: 'all' }],
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_' }],
		'@typescript-eslint/no-unnecessary-condition': 'off', // TODO: Reenable once this is fixed: https://github.com/typescript-eslint/typescript-eslint/issues/7693		'unicorn/no-array-reduce': 'off',
		'unicorn/no-array-reduce': 'off', // I like my array reduces
		'unicorn/no-array-for-each': 'off', // Gives false errors for any functions called forEach
		'unicorn/no-array-callback-reference': 'off', // needed for easy nullish checks
		'unicorn/prevent-abbreviations': 'off', // no thanks
		'unicorn/prefer-top-level-await': 'off', // Until ES2022 is used as target
		'unicorn/no-useless-undefined': 'off', // for .catch(() => undefined)
		'unicorn/no-for-loop': 'off', // Seriously?
	},
} as Linter.Config;
