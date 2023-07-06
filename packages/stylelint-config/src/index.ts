import type { Config } from 'stylelint';

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
		'scss/at-rule-no-unknown': [true, { ignoreAtRules: ['tailwind'] }],
		'no-invalid-position-at-import-rule': [true, { ignoreAtRules: ['tailwind'] }],
	},
} as Config;
