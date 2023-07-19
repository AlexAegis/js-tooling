import type { Linter } from 'eslint';

export default {
	parser: '@typescript-eslint/parser',
	overrides: [
		{
			files: ['*.svelte'],
			plugins: ['@typescript-eslint'],
			parserOptions: {
				project: true, // For @typescript-eslint
				extraFileExtensions: ['.svelte'],
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
				quotes: ['error', 'single', { avoidEscape: true }],
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
			extends: ['plugin:svelte/recommended', 'plugin:svelte/prettier'],
			parserOptions: {
				parser: '@typescript-eslint/parser', // svelte script tags read the parser from here
				extraFileExtensions: ['.svelte'],
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
				'@typescript-eslint/no-unsafe-argument': 'off', // Doesn't work properly
			},
		},
	],
	parserOptions: {
		extraFileExtensions: ['.svelte'], // ! Can't move this to the overrides section for *.svelte
	},
} as Linter.Config;
