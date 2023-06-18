import { autolib } from 'vite-plugin-autolib';
import dts from 'vite-plugin-dts';
import { conditionalPlugin } from '../helpers/conditional-plugin.plugin.js';
import { isTargetEnvNotLocal } from '../helpers/is-target-env-local.function.js';
import { defineLibConfig } from './define-config-with-defaults.function.js';

export const libraryViteConfig = defineLibConfig({
	plugins: [
		autolib(),
		conditionalPlugin(
			dts({
				entryRoot: 'src',
				copyDtsFiles: true,
			}),
			isTargetEnvNotLocal
		),
	],
});
