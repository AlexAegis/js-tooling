import type { JsonMatcherFrom } from '@alexaegis/match';
import { getEncodedArchetype, type PackageArchetype } from '@alexaegis/workspace-tools';
import {
	type AutotoolElementFileCopy,
	type AutotoolPlugin,
	type AutotoolPluginObject,
} from 'autotool-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const notCircularName = (name: string): boolean =>
	![
		'@alexaegis/ts',
		'@alexaegis/vite',
		'@alexaegis/vitest',
		'@alexaegis/eslint-config-vitest',
	].includes(name);

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	const languageMatcher = /^(ts|typescript)$/;

	const archetypeFlavours: JsonMatcherFrom<PackageArchetype>[] = [
		{ language: languageMatcher, framework: 'svelte' },
		{ language: languageMatcher, platform: 'web', framework: /^(?!svelte).*$/ },
		{ language: languageMatcher, platform: 'node', framework: /^(?!svelte).*$/ },
		{ language: languageMatcher, platform: undefined, framework: undefined },
	];

	return {
		name: packageJson.name,
		elements: [
			{
				description: 'copy workspace root ts config',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: 'tsconfig.json',
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'workspace-tsconfig.json'),
			},
			{
				description: 'add workspace root ts scripts',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						'lint:tsc': 'turbo run lint:tsc_ --concurrency 16 --cache-dir .cache/turbo',
					},
					devDependencies: {
						'@alexaegis/ts': `^${packageJson.version}`, // For the root tsConfig
						typescript: packageJson.dependencies.typescript,
						'ts-node': packageJson.devDependencies['ts-node'],
					},
				},
			},
			{
				description: 'add package ts scripts',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						language: languageMatcher,
					},
				},
				data: {
					scripts: {
						'lint:tsc':
							'turbo run lint:tsc_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:tsc_': 'tsc --noEmit',
					},
				},
			},
			{
				description: 'add package dependency for the ts configs',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						language: languageMatcher,
					},
					name: notCircularName, // Don't add a dependency for itself, and other packages where it would result in a circle
				},
				data: {
					devDependencies: {
						'@alexaegis/ts': `^${packageJson.version}`,
					},
				},
			},
			{
				description: 'remove unnecessary tsconfig files',
				executor: 'fileRemove',
				targetFilePatterns: 'tsconfig.!(json)',
			},
			{
				description: 'add @types/node as a devDependency',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						language: languageMatcher,
						framework: 'node',
					},
				},
				data: {
					devDependencies: {
						'@types/node': packageJson.devDependencies['@types/node'],
					},
				},
			},
			...archetypeFlavours.map<AutotoolElementFileCopy>((archetype) => {
				const flavour = getEncodedArchetype(archetype);

				return {
					name: `copy tsconfig for ${flavour} packages`,
					executor: 'fileCopy',
					packageKind: 'regular',
					targetFile: 'tsconfig.json',
					sourcePluginPackageName: packageJson.name,
					packageJsonFilter: {
						archetype,
					},
					sourceFile: join('static', 'package-simple-tsconfig.json'),
					templateVariables: {
						flavour,
					},
				};
			}),
		],
	};
};

export default plugin;
