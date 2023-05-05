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
			files: ['*.{ts,js,cts,cjs,mts,mjs,tsx,jsx,svelte}'],
			rules: {
				quotes: ['error', 'single', { avoidEscape: true }],
			},
		},
		{
			files: ['*.{ts,svelte}'],
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
			parser: 'svelte-eslint-parser',
			extends: ['plugin:svelte/recommended'],
			parserOptions: {
				parser: '@typescript-eslint/parser', // svelte script tags read the parser from here
			},
			globals: {
				$$Generic: true, // To let `type T = $$Generic;` be defined
			},
			rules: {
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{ varsIgnorePattern: '$$', argsIgnorePattern: '_' }, // To let $$Slot be defined
				],
				'@typescript-eslint/no-unsafe-assignment': 'off', // Cannot cast to $$Generic
			},
		},
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
		extraFileExtensions: ['.svelte'], // ! Can't move this to the overrides section for *.svelte
	},
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	rules: {
		'no-unused-vars': 'off', // Letting @typescript-eslint/no-unused-vars take helm
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_' }],
		'unicorn/no-array-reduce': 'off',
		'unicorn/no-array-callback-reference': 'off', // needed for easy nullish checks
		'unicorn/prevent-abbreviations': 'off', // no thanks
		'unicorn/prefer-top-level-await': 'off', // Until ES2022 is used as target
		'unicorn/no-useless-undefined': 'off', // for .catch(() => undefined)
		'unicorn/no-for-loop': 'off', // Seriously?,
		'unicorn/expiring-todo-comments': 'off', // TODO: Remove me once this resolves https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2076
	},
} as Linter.Config;
