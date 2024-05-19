import packageJson from '@alexaegis/autotool-plugin-commitlint/package.json' assert { type: 'json' };
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'copy workspace commitlint config',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
				targetFile: 'commitlint.config.cjs',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'commitlint.config.cjs'),
			},
			{
				description: 'add commitlint as a devDependency to the workspace',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					devDependencies: {
						commitlint: packageJson.dependencies.commitlint,
					},
				},
			},
		],
	};
};

export default plugin;
