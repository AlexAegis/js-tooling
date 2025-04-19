import { type Plugin } from 'vite';

export const importRegexBothAssertAndWith =
	/(import\s+?(?:(?:[\s\w*,{}]*\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))\s*?(?:;|$|))(\s*(?:assert|with)\s*{.*}\s*;?)/g;

export const importRegexAssertOnly =
	/(import\s+?(?:(?:[\s\w*,{}]*\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))\s*?(?:;|$|))(\s*assert\s*{.*}\s*;?)/g;

export const importRegexWithOnly =
	/(import\s+?(?:(?:[\s\w*,{}]*\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))\s*?(?:;|$|))(\s*with\s*{.*}\s*;?)/g;

const importWithAssertRegex = (keeping: ImportAttributeKinds) =>
	keeping === 'both' || keeping === true
		? importRegexBothAssertAndWith
		: keeping === 'with'
			? importRegexWithOnly
			: importRegexAssertOnly;

export interface ImportStatementsWithAsserts {
	importStatement: string;
	assertStatement: string;
}

export type ImportAttributeKinds = true | 'both' | 'assert' | 'with';

export const preserveImportAttributes = (keeping: ImportAttributeKinds = 'assert') => {
	const importsWithAssertsFileMap = new Map<string, ImportStatementsWithAsserts[]>();
	const regex = importWithAssertRegex(keeping);
	return {
		name: 'preserve-import-attributes',
		enforce: 'post',
		transform: (code, id) => {
			importsWithAssertsFileMap.set(
				id,
				[...code.matchAll(regex)]
					.map(([_, importStatement, assertStatement]) =>
						importStatement && assertStatement
							? { importStatement, assertStatement }
							: undefined,
					)
					.filter((s): s is ImportStatementsWithAsserts => !!s),
			);
		},
		generateBundle(_options, bundle) {
			for (const file of Object.values(bundle)) {
				if (file.type === 'chunk') {
					for (const moduleId of file.moduleIds) {
						const map = importsWithAssertsFileMap.get(moduleId);
						if (map) {
							for (const { importStatement, assertStatement } of map) {
								file.code = file.code.replaceAll(
									importStatement,
									importStatement + assertStatement,
								);
							}
						}
					}
				}
			}
		},
	} as Plugin;
};
