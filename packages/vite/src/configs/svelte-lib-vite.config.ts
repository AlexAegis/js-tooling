import { svelte } from '@sveltejs/vite-plugin-svelte';
import { pakk } from 'vite-plugin-pakk';
import { conditionalPlugin } from '../helpers/conditional-plugin.plugin.js';
import { isTargetEnvNotLocal } from '../helpers/is-target-env-local.function.js';
import { defineLibConfig } from './define-config-with-defaults.function.js';

export const svelteLibViteConfig = defineLibConfig({
	plugins: [svelte(), conditionalPlugin(pakk(), isTargetEnvNotLocal)],
});
