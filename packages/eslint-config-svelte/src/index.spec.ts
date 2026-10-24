import { TSESLint } from '@typescript-eslint/utils';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';
import eslintConfigSvelte, * as library from './index.js';

describe('library', () => {
	it('should be defined', () => {
		expect(library).toBeDefined();
	});
});

describe('eslintConfigSvelte', () => {
	const eslint = new TSESLint.ESLint({
		overrideConfigFile: true,
		overrideConfig: eslintConfigSvelte,
	});

	const getConfig = (filePath: string): Promise<TSESLint.FlatConfig.Config | undefined> =>
		eslint.calculateConfigForFile(filePath);

	const getRuleSeverity = async (filePath: string, rule: string): Promise<unknown> => {
		const config = await getConfig(filePath);
		const ruleEntry = config?.rules?.[rule];
		return Array.isArray(ruleEntry) ? ruleEntry[0] : ruleEntry;
	};

	it.each(['App.svelte', 'src/lib/component.svelte', 'src/routes/nested/+page.svelte'])(
		'should apply the svelte and type checked rules to %s',
		async (filePath) => {
			expect(await getRuleSeverity(filePath, 'svelte/no-at-html-tags')).toBe(2);
			expect(await getRuleSeverity(filePath, '@typescript-eslint/no-floating-promises')).toBe(
				2,
			);
			expect(await getRuleSeverity(filePath, '@typescript-eslint/no-unsafe-call')).toBe(0);
		},
	);

	it.each(['src/lib/component.svelte', 'src/lib/state.svelte.ts'])(
		'should parse %s with svelte-eslint-parser and its scripts with typescript-eslint',
		async (filePath) => {
			const config = await getConfig(filePath);

			expect(config?.languageOptions?.parser?.meta?.name).toBe('svelte-eslint-parser');
			expect(config?.languageOptions?.parserOptions?.['parser']).toBe(tseslint.parser);
		},
	);

	it('should type check svelte files with their nearest tsconfig', async () => {
		const config = await getConfig('src/routes/+page.svelte');

		expect(config?.languageOptions?.parserOptions?.project).toBe(true);
		expect(config?.languageOptions?.parserOptions?.extraFileExtensions).toEqual(['.svelte']);
	});

	it('should let the ts files share their program with the svelte files', async () => {
		const config = await getConfig('src/lib/index.ts');

		expect(config?.languageOptions?.parserOptions?.extraFileExtensions).toEqual(['.svelte']);
	});
});
