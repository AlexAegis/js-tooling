// autotool:not-managed

import { defineConfig } from 'vite';
import { pakk } from '../pakk-vite-plugin/src/index.js';

export default defineConfig({
	plugins: [
		pakk({
			dts: process.env['BUILD_REASON'] === 'publish',
		}),
	],
});
