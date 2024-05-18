import { TSESLint } from '@typescript-eslint/utils';
import tseslint from 'typescript-eslint';

export const eslintVitestConfigRestrictImports: TSESLint.FlatConfig.Config = {
	files: ['*.spec.{ts,js,cts,cjs,mts,mjs,tsx,jsx}'],
	rules: {
		'no-restricted-imports': [
			'error',
			{
				paths: ['node:test', 'test', 'chai', 'mocha', 'jest'], // Prevent imports from other test frameworks
			},
		],
	},
};

export default tseslint.config(eslintVitestConfigRestrictImports);
