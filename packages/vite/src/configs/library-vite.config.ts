import { pakk } from 'vite-plugin-pakk';
import { conditionalPlugin } from '../helpers/conditional-plugin.plugin.js';
import { isTargetEnvNotLocal } from '../helpers/is-target-env-local.function.js';
import { defineLibConfig } from './define-config-with-defaults.function.js';

export const libraryViteConfig = defineLibConfig({
	plugins: [conditionalPlugin(pakk(), isTargetEnvNotLocal)],
});
