import {
	type AutotoolPlugin,
	type AutotoolPluginObject,
	type NormalizedAutotoolPluginOptions,
	type PackageJsonFilter,
} from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

export const plugin: AutotoolPlugin = (
	_options: NormalizedAutotoolPluginOptions,
): AutotoolPluginObject => {
	const tsPackageJsonFilter: PackageJsonFilter = {
		archetype: {
			language: 'ts',
		},
	};
	const jsPackageJsonFilter: PackageJsonFilter = {
		archetype: {
			language: 'js', // Typedoc can process JSDoc too
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
				description: 'package typedoc config file (ts)',
				executor: 'fileCopy',
				packageJsonFilter: tsPackageJsonFilter,
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'package-typedoc.json'),
				targetFile: 'typedoc.json',
				sourcePluginPackageName: packageJson.name,
			},
			{
				description: 'package typedoc config file (js)',
				executor: 'fileCopy',
				packageJsonFilter: jsPackageJsonFilter,
				packageKind: 'regular',
				formatWithPrettier: true,
				sourceFile: join('static', 'package-typedoc-js.json'),
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
