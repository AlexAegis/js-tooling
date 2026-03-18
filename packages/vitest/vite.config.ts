// Intentionally imported across packages, this isn't source code so it's fine.
// It is to avoid cyclic dependencies.
import { defineConfig } from 'vite';
import { pakk } from '../pakk-vite-plugin/src/index.js';

// default config for node libraries
export default defineConfig({
	plugins: [
		pakk({
			dts: process.env['BUILD_REASON'] === 'publish',
		}),
	],
});
