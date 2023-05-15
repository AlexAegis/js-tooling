import { getEncodedArchetype, type PackageArchetype } from '@alexaegis/workspace-tools';
import {
	type AutotoolElementFileCopy,
	type AutotoolPlugin,
	type AutotoolPluginObject,
} from 'autotool-plugin';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	const archetypeFlavours: PackageArchetype[] = [
		{ platform: 'web', framework: 'svelte' },
		{ platform: 'web', framework: undefined },
		{ platform: 'node' },
		{ platform: undefined, framework: undefined }, // base
	];

	const language = /^(ts|typescript)$/;

	return {
		name: 'ts',
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
						'ts-node': packageJson.peerDependencies['ts-node'],
					},
				},
			},
			{
				description: 'add package ts scripts',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					archetype: {
						language,
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
						language,
					},
					name: (name: string) => {
						const result = '@alexaegis/ts' !== name;

						if (!result) {
							writeFileSync(name.replace('/', '') + '.not.txt', name);
						}
						return result;
					}, // Don't add a dependency for itself
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
						language,
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
						language,
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
