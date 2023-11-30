import { mergeConfig } from 'vite';
import { pakk } from 'vite-plugin-pakk';
import { conditionalPlugin } from '../helpers/conditional-plugin.plugin.js';
import { isTargetEnvNotLocal } from '../helpers/is-target-env-local.function.js';
import { DEFAULT_VITE_LIB_CONFIG } from './base-vite.config.js';

export const libraryViteConfig = mergeConfig(DEFAULT_VITE_LIB_CONFIG, {
	plugins: [conditionalPlugin(pakk(), isTargetEnvNotLocal)],
});
