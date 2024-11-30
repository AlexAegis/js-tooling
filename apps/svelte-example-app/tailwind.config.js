import { skeleton } from '@skeletonlabs/tw-plugin';
import path from 'node:path';

/**
 *
 * @type {{ handler: import('tailwindcss/types/config').PluginCreator; config?: Partial<import('tailwindcss/types/config').Config> }}
 */
// @ts-ignore reason: Type 'Partial<Config> | undefined' is not assignable to type 'Partial<Config>'.
const skeletonPlugin = skeleton({
	themes: {
		preset: ['skeleton'],
	},
});

/**
 * @type {import('tailwindcss').Config}
 */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		path.join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
	],
	theme: {
		extend: {},
	},
	plugins: [skeletonPlugin],
};
