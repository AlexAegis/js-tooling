import { autolib, DEFAULT_VITE_CONFIG } from '@alexaegis/vite';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(
	DEFAULT_VITE_CONFIG,
	defineConfig({
		plugins: [
			autolib({
				// ts doesn't actully use the exports field from the packageJson
				// file when resolving these files, that's why they are at the
				// the root of this package and not within `static/`
				autoExportStaticGlobs: ['base.json', 'lib*.json'],
			}),
		],
	})
);
