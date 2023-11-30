import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import packageJson from '../package.json';

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
