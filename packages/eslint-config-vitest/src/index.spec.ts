import { TSESLint } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';
import eslintConfigVitest, * as library from './index.js';

describe('library', () => {
	it('should be defined', () => {
		expect(library).toBeDefined();
	});
});

describe('eslintConfigVitest', () => {
	const eslint = new TSESLint.ESLint({
		overrideConfigFile: true,
		overrideConfig: eslintConfigVitest,
	});

	const getRestrictedImportsSeverity = async (filePath: string): Promise<unknown> => {
		const config = (await eslint.calculateConfigForFile(filePath)) as
			TSESLint.FlatConfig.Config | undefined;
		const ruleEntry = config?.rules?.['no-restricted-imports'];
		return Array.isArray(ruleEntry) ? ruleEntry[0] : ruleEntry;
	};

	it.each(['index.spec.ts', 'src/index.spec.ts', 'src/nested/file.spec.js'])(
		'should restrict the test framework imports in %s',
		async (filePath) => {
			expect(await getRestrictedImportsSeverity(filePath)).toBe(2);
		},
	);

	it('should not restrict the imports of a file that is not a spec', async () => {
		expect(await getRestrictedImportsSeverity('src/index.ts')).toBeUndefined();
	});
});
