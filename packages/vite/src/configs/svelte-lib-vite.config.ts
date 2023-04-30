import { svelte } from '@sveltejs/vite-plugin-svelte';
import { autolib } from 'vite-plugin-autolib';
import dts from 'vite-plugin-dts';
import { conditionalPlugin } from '../helpers/conditional-plugin.plugin.js';
import { isTargetEnvNotLocal } from '../helpers/is-target-env-local.function.js';
import { defineConfigWithDefaults } from './define-config-with-defaults.function.js';

export const svelteLibViteConfig = defineConfigWithDefaults({
	plugins: [
		svelte(),
		conditionalPlugin(
			{
				...autolib(),
				apply: 'build',
			},
			isTargetEnvNotLocal
		),
		conditionalPlugin(
			{
				...dts({
					entryRoot: 'src',
					copyDtsFiles: true,
				}),
				apply: 'build',
			},
			isTargetEnvNotLocal
		),
	],
	appType: 'spa',
});
