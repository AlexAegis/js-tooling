import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';
import config from './index.js';
import * as library from './index.js';

const warningsOf = async (code: string, rule?: string) => {
	const result = await stylelint.lint({
		code,
		codeFilename: 'app.css',
		config,
		configBasedir: fileURLToPath(new URL('..', import.meta.url)),
	});
	return result.results.flatMap((lintResult) =>
		lintResult.warnings
			.filter((warning) => rule === undefined || warning.rule === rule)
			.map(({ rule: warningRule, line, text }) => ({ rule: warningRule, line, text })),
	);
};

const tailwindStylesheet = `@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
@plugin '@tailwindcss/typography';
@source '../node_modules/@skeletonlabs/skeleton-svelte/dist';
@custom-variant dark (&:where(.dark, .dark *));

@custom-variant any-hover {
	@media (any-hover: hover) {
		&:hover {
			@slot;
		}
	}
}

@theme {
	--*: initial;
	--color-*: initial;
	--color-brand: #123456;
	--spacing: 0.25rem;
}

@utility content-auto {
	content-visibility: auto;
}

@utility scrollbar-hidden {
	&::-webkit-scrollbar {
		display: none;
	}
}

@utility tab-* {
	tab-size: --value(--tab-size-*, integer, [integer]);
}

@layer components {
	.card {
		@apply rounded p-4;
	}
}

@variant dark {
	&:hover {
		color: white;
	}
}

.panel {
	@variant dark {
		color: white;
	}
}
`;

describe('library', () => {
	it('should be defined', () => {
		expect(library).toBeDefined();
	});
});

describe('tailwind', () => {
	it('should accept a stylesheet that uses the tailwind 4 directives', async () => {
		await expect(warningsOf(tailwindStylesheet)).resolves.toEqual([]);
	});

	it.each([
		'@tailwind utilities;',
		'@theme {\n\t--color-brand: #123456;\n}',
		"@source '../node_modules/@skeletonlabs/skeleton-svelte/dist';",
		'@utility content-auto {\n\tcontent-visibility: auto;\n}',
		'@custom-variant dark (&:where(.dark, .dark *));',
		'.card {\n\t@variant dark {\n\t\tcolor: white;\n\t}\n}',
		"@plugin '@tailwindcss/typography';",
		"@config '../../tailwind.config.js';",
		"@reference '../app.css';",
		'.card {\n\t@apply rounded;\n}',
	])('should accept the at-rule of %j', async (code) => {
		await expect(warningsOf(code, 'scss/at-rule-no-unknown')).resolves.toEqual([]);
	});

	it('should still report an unknown at-rule', async () => {
		await expect(
			warningsOf('@not-a-tailwind-rule dark;', 'scss/at-rule-no-unknown'),
		).resolves.toHaveLength(1);
	});

	it('should still report a nesting selector outside of a tailwind at-rule', async () => {
		await expect(
			warningsOf('&:hover {\n\tcolor: red;\n}', 'nesting-selector-no-missing-scoping-root'),
		).resolves.toHaveLength(1);
	});

	it.each(['--Color-Brand', '--color_brand', '--color-*-brand'])(
		'should still report the custom property name %s',
		async (name) => {
			await expect(
				warningsOf(`:root {\n\t${name}: red;\n}`, 'custom-property-pattern'),
			).resolves.toHaveLength(1);
		},
	);
});
