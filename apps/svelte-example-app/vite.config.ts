// managed-by-autotool
import { DEFAULT_BUILD_TARGET } from '@alexaegis/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

export default mergeConfig(
	{
		build: {
			target: DEFAULT_BUILD_TARGET,
		},
	},
	{
		plugins: [tailwindcss(), sveltekit()],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}'],
		},
		server: {
			fs: {
				allow: ['../..'],
			},
		},
	},
);
