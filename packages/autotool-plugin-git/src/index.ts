import packageJson from '@alexaegis/autotool-plugin-git/package.json' assert { type: 'json' };
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace .gitignore file',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: '.gitignore',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'gitignore'),
			},
			{
				description: 'workspace .gitattributes files',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: '.gitattributes',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'gitattributes'),
			},
		],
	};
};

export default plugin;
