import { autolib, DEFAULT_VITE_CONFIG } from '@alexaegis/vite';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		plugins: [
			autolib({
				autoExportStaticGlobs: ['base.json', 'libinternal.json'],
			}),
		],
	})
);
