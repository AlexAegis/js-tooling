// For the glob features check out https://github.com/micromatch/micromatch

const prettierCommand = 'prettier --check';
const eslintCommand = 'eslint --max-warnings=0 --no-ignore';

export const lintStagedConfig = {
	'*.(ts|js)': [eslintCommand, prettierCommand],
	'*.css': ['stylelint', prettierCommand],
	'*.scss': ['stylelint --customSyntax=postcss-scss', prettierCommand],
	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [eslintCommand, prettierCommand],
	'*.md': ["markdownlint --ignore 'CHANGELOG.md' --ignore-path '.gitignore'", prettierCommand],
	'*.(yml|yaml)': [prettierCommand],
};
