// managed-by-autotool

/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['${relativePathFromPackageToRoot}/.eslintrc.cjs'],
	parserOptions: {
		project: ['tsconfig.json'],
		tsconfigRootDir: __dirname,
	},
};