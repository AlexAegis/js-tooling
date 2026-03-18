// Intentionally imported across packages, this isn't source code so it's fine.
// It is to avoid cyclic dependencies.
import { defineConfig } from 'vite';
import { pakk } from '../pakk-vite-plugin/src/index.js';

export default defineConfig({
	plugins: [
		pakk({
			// Check the readme too see why these files are here
			staticExports: ['base.json', 'node.json', 'web.json', 'svelte.json', 'angular.json'],
			dts: process.env['BUILD_REASON'] === 'publish',
		}),
	],
});
