// For the glob features check out https://github.com/micromatch/micromatch

const prettierCommand = 'prettier --check';
// const tscCommand = 'tsc --noEmit';

const eslintSingleFileCommand = 'eslint --max-warnings=0 --no-ignore';
const markdownCommand = 'remark --frail --no-stdout --silently-ignore';

// TODO: explore more optimal settings since eslint is slow when used on files 1 by 1

export const lintStagedConfig = {
	'**/!(shims)/*.(ts|js|cts|cjs|mts|mjs)?(x)': [eslintSingleFileCommand, prettierCommand],
	'*.css': ['stylelint', prettierCommand],
	'*.scss': ['stylelint --customSyntax=postcss-scss', prettierCommand],
	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [
		eslintSingleFileCommand,
		prettierCommand,
	],
	'*.md': [markdownCommand, prettierCommand],
	'*.(yml|yaml)': [prettierCommand],
};

/*

	'*.(ts|js|cts|cjs|mts|mjs)?(x)': (filenames: string[]): string[] => {
		const exceptShims = filenames.filter((filename) => filename.includes('/shims/'));

		const groups = groupByCommonNearestFile(exceptShims, 'tsconfig.json');

		const tsCommands: string[] = [];
		for (const [tsRoot, groupedFilenames] of Object.entries(groups)) {
			for (const filename of groupedFilenames) {
				tsCommands.push(
					`${tscCommand} --project ${join(tsRoot, 'tsconfig.json')} ${filename}`
				);
			}
		}
		console.log('LMAO', groups);
		return ['exit 1', tscCommand];
	},
	*/
