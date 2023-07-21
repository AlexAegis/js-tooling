import { pakk } from '@alexaegis/vite';
import { defineConfig } from 'vite';

// default config for node libraries
export default defineConfig({
	plugins: [
		pakk({
			developmentPackageJsonExportsTarget: 'source',
		}),
	],
});
