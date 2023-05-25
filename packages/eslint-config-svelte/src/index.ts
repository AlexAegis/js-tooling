import type { Linter } from 'eslint';

export default {
	parser: '@typescript-eslint/parser',
	overrides: [
		{
			files: ['*.svelte'],
			plugins: ['@typescript-eslint'],
			extends: [
				'plugin:@typescript-eslint/recommended', // 'plugin:@typescript-eslint/all',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:@typescript-eslint/strict',
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
		extraFileExtensions: ['.svelte'], // ! Can't move this to the overrides section for *.svelte
	},
} as Linter.Config;
