/** @type {import('@alexaegis/setup-eslint').Linter.Config} */
module.exports = {
	extends: ['../../.eslintrc.cjs'],
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
};
