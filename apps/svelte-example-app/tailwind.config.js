import { skeleton } from '@skeletonlabs/tw-plugin';
import path from 'node:path';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		path.join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
	],
	theme: {
		extend: {},
	},
	plugins: [
		skeleton({
			themes: {
				preset: ['skeleton'],
			},
		}),
	],
};
