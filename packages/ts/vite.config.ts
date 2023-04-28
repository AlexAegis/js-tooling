import {
	autolib,
	conditionalPlugin,
	defineConfigWithDefaults,
	isTargetEnvNotLocal,
} from '@alexaegis/vite';
import dts from 'vite-plugin-dts';

export default defineConfigWithDefaults({
	plugins: [
		conditionalPlugin(
			{
				...autolib({
					// Check the readme too see why these files are here
					autoExportStaticGlobs: ['base.json', 'node.json', 'web.json', 'svelte.json'],
				}),
				apply: 'build',
			},
			isTargetEnvNotLocal
		),
		conditionalPlugin(
			{
				...dts({
					entryRoot: 'src',
					copyDtsFiles: true,
				}),
				apply: 'build',
			},
			isTargetEnvNotLocal
		),
	],
});
