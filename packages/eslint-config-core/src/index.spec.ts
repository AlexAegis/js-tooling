import { TSESLint } from '@typescript-eslint/utils';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { describe, expect, it } from 'vitest';
import eslintConfigCore, * as library from './index.js';

describe('library', () => {
	it('should be defined', () => {
		expect(library).toBeDefined();
	});
});

describe('unicorn rule names', () => {
	it('should only set unicorn rules that exist and are not deprecated', () => {
		const recommendedRules = eslintPluginUnicorn.configs.recommended.rules ?? {};
		const ownRuleNames = eslintConfigCore
			.flatMap((config) => Object.entries(config.rules ?? {}))
			.filter(
				([rule, entry]) => rule.startsWith('unicorn/') && entry !== recommendedRules[rule],
			)
			.map(([rule]) => rule.slice('unicorn/'.length));

		const unknownRuleNames = ownRuleNames.filter((name) => {
			const rule = eslintPluginUnicorn.rules?.[name];
			return !rule || !!rule.meta?.deprecated;
		});

		expect(ownRuleNames.length).toBeGreaterThan(0);
		expect(unknownRuleNames).toEqual([]);
	});
});

describe('eslintConfigCore', () => {
	const eslint = new TSESLint.ESLint({
		overrideConfigFile: true,
		overrideConfig: eslintConfigCore,
	});

	const getRuleSeverity = async (filePath: string, rule: string): Promise<unknown> => {
		const config = (await eslint.calculateConfigForFile(filePath)) as
			TSESLint.FlatConfig.Config | undefined;
		const ruleEntry = config?.rules?.[rule];
		return Array.isArray(ruleEntry) ? ruleEntry[0] : ruleEntry;
	};

	it.each(['index.ts', 'src/index.ts', 'src/nested/file.spec.mts', 'src/component.tsx'])(
		'should apply the type checked rules to %s',
		async (filePath) => {
			expect(
				await getRuleSeverity(filePath, '@typescript-eslint/no-unnecessary-type-assertion'),
			).toBe(2);
			expect(await getRuleSeverity(filePath, 'quotes')).toBe(2);
		},
	);

	it.each(['eslint.config.js', 'src/index.js', 'static/nested/config.cjs'])(
		'should apply the javascript rules without type checking to %s',
		async (filePath) => {
			expect(await getRuleSeverity(filePath, 'quotes')).toBe(2);
			expect(
				await getRuleSeverity(filePath, '@typescript-eslint/no-unnecessary-type-assertion'),
			).toBe(0);
		},
	);

	it('should parse the syntax that node 24 runs in javascript files', async () => {
		const [result] = await eslint.lintText(
			"import packageJson from './package.json' with { type: 'json' };\nexport const pattern = /(?<y>a)|(?<y>b)|(?i:c)/;\nexport const use = (r) => {\n\tusing handle = r;\n\treturn handle;\n};\nexport default packageJson;\n",
			{ filePath: 'src/sample.js' },
		);

		expect(result?.messages.filter((message) => message.fatal)).toEqual([]);
	});

	it.each(['src/index.ts', 'src/index.js'])(
		'should apply the recommended unicorn rules to %s',
		async (filePath) => {
			expect(await getRuleSeverity(filePath, 'unicorn/no-null')).toBe(2);
			expect(await getRuleSeverity(filePath, 'unicorn/prefer-node-protocol')).toBe(2);
			expect(await getRuleSeverity(filePath, 'unicorn/prefer-await')).toBe(2);
			expect(await getRuleSeverity(filePath, 'unicorn/prefer-top-level-await')).toBe(2);
		},
	);

	it('should turn off the opted out unicorn rules', async () => {
		expect(await getRuleSeverity('src/index.ts', 'unicorn/consistent-boolean-name')).toBe(0);
		expect(await getRuleSeverity('src/index.ts', 'unicorn/no-top-level-side-effects')).toBe(0);
		expect(await getRuleSeverity('src/index.ts', 'unicorn/name-replacements')).toBe(0);
	});

	it('should keep the custom typescript rules over the presets', async () => {
		const config = (await eslint.calculateConfigForFile('src/index.ts')) as
			TSESLint.FlatConfig.Config | undefined;

		expect(
			await getRuleSeverity('src/index.ts', '@typescript-eslint/no-unnecessary-condition'),
		).toBe(0);
		expect(await getRuleSeverity('src/index.ts', '@typescript-eslint/no-unused-vars')).toBe(1);
		expect(config?.rules?.['@typescript-eslint/restrict-template-expressions']).toEqual([
			2,
			expect.objectContaining({ allowBoolean: true, allowNumber: true }),
		]);
	});

	it('should keep the usual jsdoc comment styles', async () => {
		expect(
			await getRuleSeverity('src/index.js', 'unicorn/single-line-block-comment-style'),
		).toBe(0);
		expect(
			await getRuleSeverity(
				'src/index.ts',
				'unicorn/no-asterisk-prefix-in-documentation-comments',
			),
		).toBe(0);
	});

	it('should turn off the unicorn rules that conflict with prettier', async () => {
		expect(await getRuleSeverity('src/index.ts', 'unicorn/no-nested-ternary')).toBe(0);
		expect(await getRuleSeverity('src/index.ts', 'unicorn/number-literal-case')).toBe(0);
	});
});
