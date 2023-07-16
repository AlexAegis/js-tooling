import remarkGfm from 'remark-gfm';
import remarkLint from 'remark-lint';
import remarkLintListItemIndent from 'remark-lint-list-item-indent';
import remarkLintListItemSpacing from 'remark-lint-list-item-spacing';
import remarkLintNoDuplicateHeadings from 'remark-lint-no-duplicate-headings';
import remarkLintNoDuplicateHeadingsInSection from 'remark-lint-no-duplicate-headings-in-section';
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkPresetPrettier from 'remark-preset-prettier';
import remarkValidateLinks from 'remark-validate-links';
import type { Preset } from 'unified';
import unifiedConsistency from 'unified-consistency';
import unifiedPrettier from 'unified-prettier';

/**
 * Peek
 *
 * ```js
 * remarkLint,
 * remarkGfm,
 * remarkValidateLinks,
 * remarkPresetLintRecommended,
 * remarkPresetLintConsistent,
 * remarkPresetLintMarkdownStyleGuide,
 * [remarkLintListItemSpacing, false, false],
 * [remarkLintNoDuplicateHeadings, true],
 * [remarkLintListItemIndent, false], // Conflicts with prettier
 * [remarkLintOrderedListMarkerValue, true, 'ordered'],
 * remarkLintNoDuplicateHeadingsInSection,
 * remarkPresetPrettier,
 * unifiedPrettier,
 * unifiedConsistency,
 * ```
 */
export default {
	settings: { bullet: '-', quote: "'", tightDefinitions: true },
	plugins: [
		remarkLint,
		remarkGfm,
		remarkValidateLinks,
		remarkPresetLintRecommended,
		remarkPresetLintConsistent,
		remarkPresetLintMarkdownStyleGuide,
		[remarkLintListItemSpacing, false, false],
		[remarkLintNoDuplicateHeadings, true],
		[remarkLintListItemIndent, false], // Conflicts with prettier
		[remarkLintOrderedListMarkerValue, true, 'ordered'],
		remarkLintNoDuplicateHeadingsInSection,
		remarkPresetPrettier,
		unifiedPrettier,
		unifiedConsistency,
	],
} as Preset;
