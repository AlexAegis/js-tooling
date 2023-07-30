// managed-by-autotool

import { defineAppConfig } from '@alexaegis/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineAppConfig({
	plugins: [svelte()],
	appType: 'spa',
	server: {
		fs: {
			allow: ['${relativePathFromPackageToRoot}'],
		},
	},
});
