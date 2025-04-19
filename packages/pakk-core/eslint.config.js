import eslintConfigCore from '@alexaegis/eslint-config-core';

import tseslint from 'typescript-eslint';

const eslintVitestConfigRestrictImports = {
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

const eslintConfigVitest = tseslint.config(eslintVitestConfigRestrictImports);

export default [...eslintConfigCore, ...eslintConfigVitest];
