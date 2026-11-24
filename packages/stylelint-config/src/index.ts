import type { Config } from 'stylelint';

const tailwindAtRules = [
	'tailwind',
	'theme',
	'source',
	'utility',
	'variant',
	'custom-variant',
	'plugin',
	'config',
	'reference',
];

export default {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-standard-scss',
		'stylelint-config-html',
	],
	// ? This is for Svelte only. Maybe move it into it's own package?
	rules: {
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['global'],
			},
		],
		'at-rule-no-unknown': undefined,
		'scss/at-rule-no-unknown': [true, { ignoreAtRules: tailwindAtRules }],
		'no-invalid-position-at-import-rule': [true, { ignoreAtRules: ['tailwind'] }],
		'nesting-selector-no-missing-scoping-root': [
			true,
			{ ignoreAtRules: ['custom-variant', 'utility', 'variant'] },
		],
		'custom-property-pattern': [
			String.raw`^(\*|([a-z][a-z0-9]*)(-[a-z0-9]+)*(-\*)?)$`,
			{
				message: (name: string) =>
					`Expected custom property name "${name}" to be kebab-case`,
			},
		],
	},
	overrides: [
		{
			files: ['**/*.css'],
			rules: {
				'scss/operator-no-unspaced': undefined,
			},
		},
	],
} as Config;
