import { defineConfig } from 'vite';
import { autolib } from 'vite-plugin-autolib';
import dts from 'vite-plugin-dts';

export const libraryViteConfig = defineConfig({
	plugins: [
		autolib(),
		dts({
			entryRoot: 'src',
		}),
	],
});
