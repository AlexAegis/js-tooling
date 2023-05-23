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
	},
} as Config;
