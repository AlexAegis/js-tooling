import js from '@eslint/js';
import { TSESLint } from '@typescript-eslint/utils';

import eslintPluginUnicornImport from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// the plugin is esm only, so in the cjs build this import is its module namespace
const eslintPluginUnicorn =
	(eslintPluginUnicornImport as { default?: typeof eslintPluginUnicornImport }).default ??
	eslintPluginUnicornImport;

const commonIgnores: string[] = [
	'**/package-lock.json',
	'**/node_modules',
	'**/vite.config.ts.*',
	'**/vitest.config.ts.*',
	'**/.vitepress',
	'**/typedoc',
	'**/.svelte-kit',
	'**/.vercel',
	'**/build',
	'**/dist',
	'**/coverage',
	'**/.turbo',
	'**/tmp',
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
			extraFileExtensions: ['.json'],
		},
	},
	rules: {
		'no-unused-vars': 'off', // Letting @typescript-eslint/no-unused-vars take helm
		'prefer-const': ['error', { destructuring: 'all' }],
	},
};

const unicornConfig: TSESLint.FlatConfig.Config = {
	...eslintPluginUnicorn.configs.recommended,
	rules: {
		...eslintPluginUnicorn.configs.recommended.rules,
		// formatting rules that eslint-config-prettier turns off, prettier formats these
		'unicorn/empty-brace-spaces': 'off',
		'unicorn/no-nested-ternary': 'off',
		'unicorn/number-literal-case': 'off',
		'unicorn/template-indent': 'off',
		'unicorn/no-array-reduce': 'off', // I like my array reduces
		'unicorn/no-for-each': 'off', // Gives false errors for any functions called forEach
		'unicorn/no-array-callback-reference': 'off', // needed for easy nullish checks
		'unicorn/name-replacements': 'off', // no thanks
		'unicorn/no-useless-undefined': 'off', // for .catch(() => undefined)
		'unicorn/no-for-loop': 'off', // Seriously?
		'unicorn/import-style': 'off', // Forces you to use default imports for node: modules
		'unicorn/no-top-level-side-effects': 'off', // config files are a single top level export call
		'unicorn/no-asterisk-prefix-in-documentation-comments': 'off', // keeps the usual jsdoc style
		'unicorn/single-line-block-comment-style': 'off', // keeps one line /** @type */ comments
		'unicorn/consistent-boolean-name': 'off', // also flags predicate functions, like match
	},
};

const mocksConfig: TSESLint.FlatConfig.Config = {
	files: ['**/__mocks__/**'],
	rules: {
		'unicorn/filename-case': 'off', // vitest requires the __mocks__ name
	},
};
const useSingleQuotes: TSESLint.FlatConfig.Config = {
	files: ['**/*.{ts,js,cts,cjs,mts,mjs,tsx,jsx}'],
	rules: {
		quotes: ['error', 'single', { avoidEscape: true }],
	},
};

const typescriptLintConfig: TSESLint.FlatConfig.ConfigArray = [
	...tseslint.configs.recommendedTypeChecked.map((config) => ({
		...config,
		files: ['**/*.{ts,tsx,cts,mts}'],
	})),
	...tseslint.configs.strictTypeChecked.map((config) => ({
		...config,
		files: ['**/*.{ts,tsx,cts,mts}'],
	})),
	...tseslint.configs.stylisticTypeChecked.map((config) => ({
		...config,
		files: ['**/*.{ts,tsx,cts,mts}'],
	})),
	// after the presets, so these options and overrides are not reset by them
	{
		files: ['**/*.{ts,tsx,cts,mts}'],
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		languageOptions: {
			parser: tseslint.parser,
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
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', ignoreRestSiblings: true },
			],
			'@typescript-eslint/no-unnecessary-condition': 'off', // TODO: Reenable once this is fixed: https://github.com/typescript-eslint/typescript-eslint/issues/7693		'unicorn/no-array-reduce': 'off',
		},
	},
	{
		files: ['**/*.{js,cjs,mjs,jsx}'],
		...tseslint.configs.disableTypeChecked,
	},
];

const eslintConfigCore: TSESLint.FlatConfig.ConfigArray = [
	ignoreConfig,
	js.configs.recommended,
	baseConfig,
	useSingleQuotes,
	unicornConfig,
	mocksConfig,
	...typescriptLintConfig,
];

export default eslintConfigCore;
