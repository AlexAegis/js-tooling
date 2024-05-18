import js from '@eslint/js';
import { TSESLint } from '@typescript-eslint/utils';

import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const commonIgnores: string[] = [
	'**/package-lock.json',
	'**/node_modules',
	'**/vite.config.ts.*',
	'**/vitest.config.ts.*',
	'**/.vitepress',
	'**/shims',
	'**/typedoc',
	'**/.svelte-kit',
	'**/.vercel',
	'**/build',
	'**/dist',
	'**/coverage',
	'**/.turbo',
	'**/tmp',
	'**/shims',
];

const ignoreConfig: TSESLint.FlatConfig.Config = {
	ignores: commonIgnores,
};

const baseConfig: TSESLint.FlatConfig.Config = {
	languageOptions: {
		globals: {
			...globals.browser,
			...globals.node,
		},
		ecmaVersion: 'latest',
		parserOptions: {
			sourceType: 'module',
			ecmaVersion: 2024,
			extraFileExtensions: ['.json'],
		},
	},
	rules: {
		'no-unused-vars': 'off', // Letting @typescript-eslint/no-unused-vars take helm
		'prefer-const': ['error', { destructuring: 'all' }],
	},
};

const unicornConfig: TSESLint.FlatConfig.Config = {
	plugins: {
		unicorn: eslintPluginUnicorn,
	},
	rules: {
		'unicorn/no-array-reduce': 'off', // I like my array reduces
		'unicorn/no-array-for-each': 'off', // Gives false errors for any functions called forEach
		'unicorn/no-array-callback-reference': 'off', // needed for easy nullish checks
		'unicorn/prevent-abbreviations': 'off', // no thanks
		'unicorn/prefer-top-level-await': 'off', // Until ES2022 is used as target
		'unicorn/no-useless-undefined': 'off', // for .catch(() => undefined)
		'unicorn/no-for-loop': 'off', // Seriously?
	},
};
const useSingleQuotes: TSESLint.FlatConfig.Config = {
	files: ['*.{ts,js,cts,cjs,mts,mjs,tsx,jsx}'],
	rules: {
		quotes: ['error', 'single', { avoidEscape: true }],
	},
};

const typescriptLintConfig: TSESLint.FlatConfig.ConfigArray = tseslint.config(
	{
		files: ['*.{ts,tsx,cts,mts}'],
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		languageOptions: {
			parser: tseslint.parser as any,
			parserOptions: {
				project: true,
			},
		},
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
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '_' }],
			'@typescript-eslint/no-unnecessary-condition': 'off', // TODO: Reenable once this is fixed: https://github.com/typescript-eslint/typescript-eslint/issues/7693		'unicorn/no-array-reduce': 'off',
		},
	},
	...tseslint.configs.recommendedTypeChecked.map((config) => ({
		...config,
		files: ['*.{ts,tsx,cts,mts}'],
	})),
	...tseslint.configs.strictTypeChecked.map((config) => ({
		...config,
		files: ['*.{ts,tsx,cts,mts}'],
	})),
	...tseslint.configs.stylisticTypeChecked.map((config) => ({
		...config,
		files: ['*.{ts,tsx,cts,mts}'],
	})),
	{
		files: ['*.{js,cjs,mjs,jsx}'],
		...tseslint.configs.disableTypeChecked,
	},
);

export default tseslint.config(
	ignoreConfig,
	js.configs.recommended,
	baseConfig,
	useSingleQuotes,
	unicornConfig,
	...typescriptLintConfig,
);
