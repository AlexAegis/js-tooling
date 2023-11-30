// autotool:not-managed

import { defineConfig } from 'vite';
import { pakk } from 'vite-plugin-pakk';

export default defineConfig({
	plugins: [
		pakk({
			dts: process.env['BUILD_REASON'] === 'publish',
		}),
	],
});
