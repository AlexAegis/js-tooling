// managed-by-autotool
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mergeConfig } from 'vite';

export default mergeConfig(
	{
		build: {
			// Keep in sync with @alexaegis/vite DEFAULT_BUILD_TARGET.
			// This is intentionally inlined so `svelte-kit sync` works during clean install
			// before @alexaegis/vite dist files are built.
			target: 'es2022',
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
