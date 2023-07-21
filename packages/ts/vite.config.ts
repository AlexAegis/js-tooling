import { pakk } from '@alexaegis/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		pakk({
			// Check the readme too see why these files are here
			staticExports: ['base.json', 'node.json', 'web.json', 'svelte.json', 'angular.json'],
			dts: process.env['BUILD_REASON'] === 'publish',
		}),
	],
});
