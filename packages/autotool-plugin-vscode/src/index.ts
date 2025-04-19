import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'vscode settings',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				formatWithPrettier: true,
				sourceFile: join('static', 'settings.json'),
				targetFile: join('.vscode', 'settings.json'),
			},
			{
				description: 'vscode extension recommendations',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				formatWithPrettier: true,
				sourceFile: join('static', 'extensions.json'),
				targetFile: join('.vscode', 'extensions.json'),
			},
			{
				description: 'vscode launch configurations',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				formatWithPrettier: true,
				sourceFile: join('static', 'launch.json'),
				targetFile: join('.vscode', 'launch.json'),
			},
			{
				description: 'vscode tasks',
				executor: 'fileCopy',
				packageKind: 'root',
				sourcePluginPackageName: packageJson.name,
				formatWithPrettier: true,
				sourceFile: join('static', 'tasks.json'),
				targetFile: join('.vscode', 'tasks.json'),
			},
		],
	};
};

export default plugin;
