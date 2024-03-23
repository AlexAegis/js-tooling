import type { Linter } from 'eslint';

export default {
	parser: '@typescript-eslint/parser',
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-type-checked',
				'plugin:@typescript-eslint/strict',
				'plugin:@typescript-eslint/strict-type-checked',
				'plugin:@typescript-eslint/stylistic',
				'plugin:@typescript-eslint/stylistic-type-checked',
				'plugin:svelte/recommended',
				'plugin:svelte/prettier',
			],
			parserOptions: {
				project: true, // For @typescript-eslint
				parser: '@typescript-eslint/parser', // svelte script tags read the parser from here
				extraFileExtensions: ['.svelte'],
			},
			globals: {
				// To let `type T = $$Generic;` be defined (Old generics syntax, <script lang="ts" generics="T"> is preferred)
				$$Generic: 'readonly',
			},
			settings: {
				svelte: {
					// These ignores will affect only the component template, but not the script tag
					ignoreWarnings: [
						'@typescript-eslint/no-unsafe-assignment',
						'@typescript-eslint/no-unsafe-member-access',
						'@typescript-eslint/no-unsafe-call',
						'@typescript-eslint/no-unsafe-return',
						'@typescript-eslint/no-unsafe-argument',
						'@typescript-eslint/no-confusing-void-expression',
					],
				},
			},
			rules: {
				quotes: ['error', 'single', { avoidEscape: true }],
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
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{ varsIgnorePattern: '$$', argsIgnorePattern: '_' }, // To let $$Slot be defined
				],
				'no-undef': 'off', // TODO: the new generics feature doesn't like this https://github.com/sveltejs/eslint-plugin-svelte/issues/521
				'@typescript-eslint/dot-notation': 'off', // Conflicts with: "Property comes from an index signature, so it must be accessed with [].js(4111)"
				'@typescript-eslint/no-unsafe-call': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off', // TODO: Because generics aren't properly supported yet Remove once this is resolved: https://github.com/sveltejs/eslint-plugin-svelte/issues/521
				'@typescript-eslint/no-unnecessary-condition': 'off', // @typescript-eslint doesn't know if a field can changed by svelte, like an input field, so a field like export let isEnabled: boolean = true; will always be seen as just true by the linter.
			},
		},
	],
	parserOptions: {
		extraFileExtensions: ['.svelte'], // ! Can't move this to the overrides section for *.svelte
	},
} as Linter.Config;
