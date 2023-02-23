import { autolib } from 'vite-plugin-autolib';
import dts from 'vite-plugin-dts';
import { defineConfigWithDefaults } from './define-config-with-defaults.function.js';

export const libraryViteConfig = defineConfigWithDefaults({
	plugins: [
		autolib(),
		dts({
			entryRoot: 'src',
			copyDtsFiles: true,
		}),
	],
});
