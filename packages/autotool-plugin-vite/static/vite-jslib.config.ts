// managed-by-autotool

import { pakk } from '@alexaegis/vite';
import { defineConfig } from 'vite';

// default config for node libraries using plain javascript
export default defineConfig({
	build: {
		rollupOptions: {
			output: {
				preserveModules: true,
			},
		},
	},
	plugins: [
		pakk({
			developmentPackageJsonExportsTarget: 'source',
		}),
	],
});
