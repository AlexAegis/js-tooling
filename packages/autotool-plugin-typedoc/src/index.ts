import {
	type AutotoolPlugin,
	type AutotoolPluginObject,
	type PackageJsonFilter,
} from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	const packageJsonFilter: PackageJsonFilter = {
		archetype: {
			language: /^(ts|js)$/, // Typedoc can process JSDoc too
		},
	};

	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace typedoc scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						typedoc: 'turbo run typedoc_ --concurrency 16',
						typedoc_: 'typedoc',
					},
					devDependencies: {
						typedoc: packageJson.dependencies.typedoc,
					},
				},
			},
			{
				description: 'package typedoc config file',
				executor: 'fileCopy',
				packageJsonFilter,
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'package-typedoc.json'),
				targetFile: 'typedoc.json',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'workspace typedoc config file',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
				sourceFile: join('static', 'workspace-typedoc.json'),
				targetFile: 'typedoc.json',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'workspace base typedoc config file',
				executor: 'fileCopy',
				packageKind: 'root',
				sourceFile: join('static', 'typedoc.base.json'),
				targetFile: join('.config', 'typedoc.base.json'),
				sourcePluginPackageName: packageJson.name,
			},
		],
	};
};

export default plugin;
