// managed-by-autotool
import { DEFAULT_VITE_APP_CONFIG } from '@alexaegis/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mergeConfig } from 'vite';

export default mergeConfig(DEFAULT_VITE_APP_CONFIG, {
	plugins: [svelte()],
	appType: 'spa',
	server: {
		fs: {
			allow: ['${relativePathFromPackageToRoot}'],
		},
	},
});
