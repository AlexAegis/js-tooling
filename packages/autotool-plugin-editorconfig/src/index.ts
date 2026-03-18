import {
	type AutotoolPlugin,
	type AutotoolPluginObject,
	type NormalizedAutotoolPluginOptions,
} from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

export const plugin: AutotoolPlugin = (
	_options: NormalizedAutotoolPluginOptions,
): AutotoolPluginObject => {
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
