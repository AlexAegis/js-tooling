// For the glob features check out https://github.com/micromatch/micromatch
import { groupByCommonNearestFile } from '@alexaegis/fs';
import type { Config } from 'lint-staged';
import { join } from 'node:path';

const prettierCommand = 'prettier --check';
const tscCommand = 'tsc --noEmit';

const eslintSingleFileCommand = 'eslint --max-warnings=0 --no-ignore';
const markdownCommand = 'remark --frail --no-stdout --silently-ignore';

// TODO: explore more optimal settings since eslint is slow when used on files 1 by 1
/**
 * Peek
 * ```js
 *	'!(shims)/(*.(ts|js|cts|cjs|mts|mjs|jsx|tsx)|tsconfig*.json)?(x)': tsc,
 *	'!(shims)/*.(ts|js|cts|cjs|mts|mjs)': [eslintSingleFileCommand, prettierCommand],
 *	'*.css': ['stylelint', prettierCommand],
 *	'*.scss': ['stylelint --customSyntax=postcss-scss', prettierCommand],
 *	'*.(html|svelte|vue|astro|xml|php)': ['stylelint --customSyntax=postcss-html'],
 *	'*.(html|vue|astro|xml)': [prettierCommand],
 *	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [
 *		eslintSingleFileCommand,
 *		prettierCommand,
 *	],
 *	'*.svelte': ['svelte-check', prettierCommand],
 *	'*.md': [markdownCommand, prettierCommand],
 *	'*.(yml|yaml)': [prettierCommand],
 * ```
 *
 * ---
 *
 * ```js
 * const prettierCommand = 'prettier --check';
 * const tscCommand = 'tsc --noEmit';
 *
 * const eslintSingleFileCommand = 'eslint --max-warnings=0 --no-ignore';
 * const markdownCommand = 'remark --frail --no-stdout --silently-ignore';
 * ```
 */
export const lintStagedConfig: Config = {
	'**/!(shims)/(*.(ts|js|cts|cjs|mts|mjs|jsx|tsx)|tsconfig*.json)?(x)': (
		filenames: string[],
	): string[] => {
		const groups = groupByCommonNearestFile(filenames, 'tsconfig.json');
		return Object.keys(groups).map(
			(tsRoot) => `${tscCommand} --project ${join(tsRoot, 'tsconfig.json')}`,
		);
	},
	'**/!(shims)/*.(ts|js|cts|cjs|mts|mjs)': [eslintSingleFileCommand, prettierCommand],
	'*.css': ['stylelint', prettierCommand],
	'*.scss': ['stylelint --customSyntax=postcss-scss', prettierCommand],
	'*.(html|svelte|vue|astro|xml|php)': ['stylelint --customSyntax=postcss-html'],
	'*.(html|vue|astro|xml)': [prettierCommand],
	'(*.json|.eslintrc|.prettierrc|.stylelintrc|.markdownlintrc)': [
		eslintSingleFileCommand,
		prettierCommand,
	],
	'*.svelte': ['svelte-check', prettierCommand],
	'*.md': [markdownCommand, prettierCommand],
	'*.(yml|yaml)': [prettierCommand],
};
