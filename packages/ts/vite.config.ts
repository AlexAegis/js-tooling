import { autolib, defineConfigWithDefaults } from '@alexaegis/vite';

export default defineConfigWithDefaults({
	plugins: [
		autolib({
			// Check the readme too see why these files are here
			autoExportStaticGlobs: ['base.json', 'node.json', 'web.json', 'svelte.json'],
		}),
	],
});
