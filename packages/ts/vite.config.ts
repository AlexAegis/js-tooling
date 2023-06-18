import { autolib, conditionalPlugin, defineLibConfig, isTargetEnvNotLocal } from '@alexaegis/vite';
import dts from 'vite-plugin-dts';

export default defineLibConfig({
	plugins: [
		conditionalPlugin(
			autolib({
				// Check the readme too see why these files are here
				autoExportStaticGlobs: [
					'base.json',
					'node.json',
					'web.json',
					'svelte.json',
					'angular.json',
				],
			}),
			isTargetEnvNotLocal
		),
		conditionalPlugin(
			dts({
				entryRoot: 'src',
				copyDtsFiles: true,
			}),
			isTargetEnvNotLocal
		),
	],
});
