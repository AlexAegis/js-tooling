import {
	type AutotoolPlugin,
	type AutotoolPluginObject,
	type NormalizedAutotoolPluginOptions,
	type PackageJsonFilter,
} from 'autotool-plugin';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import packageJson from '../package.json' with { type: 'json' };

const documentedWorkspaceFolders = ['libs', 'packages'];

// Same folders that typedoc expands `${folder}/*` to: no symlinks, dot folders or node_modules
const containsPackage = (folder: string): boolean =>
	existsSync(folder) &&
	statSync(folder).isDirectory() &&
	readdirSync(folder, { withFileTypes: true }).some(
		(entry) =>
			entry.isDirectory() &&
			!entry.name.startsWith('.') &&
			entry.name !== 'node_modules' &&
			existsSync(join(folder, entry.name, 'package.json')),
	);

/**
 * typedoc warns about each glob that matches no package, so only the documented
 * folders with packages are entry points. Without such folders, the entry point
 * is the root package.
 */
export const getWorkspaceTypedocEntryPoints = (rootPath: string): string[] => {
	const entryPoints = documentedWorkspaceFolders
		.filter((folder) => containsPackage(join(rootPath, folder)))
		.map((folder) => `${folder}/*`);
	return entryPoints.length > 0 ? entryPoints : ['.'];
};

export const transformWorkspaceTypedocConfig = (content: string, rootPath: string): string =>
	JSON.stringify(
		{
			...(JSON.parse(content) as Record<string, unknown>),
			entryPoints: getWorkspaceTypedocEntryPoints(rootPath),
			// Otherwise typedoc renders the root readme and warns on each package link in it
			readme: 'none',
		},
		undefined,
		'\t',
	) + '\n';

export const plugin: AutotoolPlugin = (
	options: NormalizedAutotoolPluginOptions,
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
				transformers: [
					(content) =>
						transformWorkspaceTypedocConfig(
							content,
							options.rootWorkspacePackage.packagePath,
						),
				],
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
