// For the glob features check out https://github.com/micromatch/micromatch

const prettierCommand = 'prettier --check';
const eslintCommand = 'eslint --max-warnings=0 --no-ignore';
const markdownCommand = 'remark --frail --no-stdout';

export const lintStagedConfig = {
	'*.(ts|js)': [eslintCommand, prettierCommand],
	'*.css': ['stylelint', prettierCommand],
	'*.scss': ['stylelint --customSyntax=postcss-scss', prettierCommand],
	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [eslintCommand, prettierCommand],
	'*.md': [markdownCommand, prettierCommand],
	'*.(yml|yaml)': [prettierCommand],
};