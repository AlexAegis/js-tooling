import type { Linter } from 'eslint';

export default {
	extends: ['@alexaegis/eslint-config-core'],
	plugins: ['svelte'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte/svelte' }],
	settings: {
		'svelte3/typescript': () => require('typescript'),
	},
} as Linter.Config;
