/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['../../.eslintrc.cjs', '@alexaegis/eslint-config-vitest'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['tsconfig.json'],
		tsconfigRootDir: __dirname,
		extraFileExtensions: ['.svelte'], // ! Can't move this to the overrides section for *.svelte
	},
	rules: {
		'unicorn/no-empty-file': 'off',
	},
	overrides: [
		{
			files: ['*.ts'],
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
					{
						varsIgnorePattern: '$$',
						argsIgnorePattern: '_',
					}, // To let $$Slot be defined
				],
				'@typescript-eslint/no-unsafe-assignment': 'off', // Cannot cast to $$Generic
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
					{
						varsIgnorePattern: '$$',
						argsIgnorePattern: '_',
					}, // To let $$Slot be defined
				],
				'@typescript-eslint/no-unsafe-assignment': 'off', // Cannot cast to $$Generic
			},
		},
	],
};
