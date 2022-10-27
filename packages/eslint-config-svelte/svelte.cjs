module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',

		'turbo',
		'next',
		'prettier',
	],
	plugins: ['svelte', '@typescript-eslint'],
	ignorePatterns: ['*.cjs', 'node_modules', 'dist'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte/svelte' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
		next: {
			rootDir: ['apps/*/'],
		},
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		quotes: ['error', 'single', { avoidEscape: true }],
	},
};
