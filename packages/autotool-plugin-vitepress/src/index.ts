import packageJson from '@alexaegis/autotool-plugin-vitepress/package.json' assert { type: 'json' };
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace scripts of vitepress',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						docs: 'vitepress dev ${relativePathFromPackageToRoot}/docs/',
						'docs:build': 'vitepress build ${relativePathFromPackageToRoot}/docs/',
						'docs:preview': 'vitepress preview ${relativePathFromPackageToRoot}/docs/',
					},
					devDependencies: {
						vitepress: packageJson.devDependencies.vitepress,
					},
				},
			},
		],
	};
};

export default plugin;
