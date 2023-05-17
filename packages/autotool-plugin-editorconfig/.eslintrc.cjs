// managed-by-autotool

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['../../.eslintrc.cjs', '@alexaegis/eslint-config-vitest'],
	parserOptions: {
		project: ['tsconfig.json'],
		tsconfigRootDir: __dirname,
	},
};
