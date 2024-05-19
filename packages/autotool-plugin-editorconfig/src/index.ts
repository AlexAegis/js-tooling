import packageJson from '@alexaegis/autotool-plugin-editorconfig/package.json' assert { type: 'json' };
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'copy workspace editorconfig config',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: '.editorconfig',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'editorconfig'),
			},
		],
	};
};

export default plugin;
