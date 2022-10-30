import { autoPackagePlugin, baseViteConfig } from '@alexaegis/vite';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(
	baseViteConfig,
	defineConfig({
		plugins: [
			autoPackagePlugin({
				autoExportStaticGlobs: ['base.json', 'libinternal.json'],
			}),
		],
	})
);
