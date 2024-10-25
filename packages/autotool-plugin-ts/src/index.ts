import packageJson from '@alexaegis/autotool-plugin-ts/package.json' assert { type: 'json' };
import type { JsonMatcherFrom } from '@alexaegis/match';
import { contains, equal, not, or } from '@alexaegis/predicate';
import { getEncodedArchetype, type PackageArchetype } from '@alexaegis/workspace-tools';
import type {
	AutotoolElementFileCopy,
	AutotoolPlugin,
	AutotoolPluginObject,
} from 'autotool-plugin';
import { join } from 'node:path';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	// Plan js libs also matched to be able to lint:tsc JSDoc style types
	const languageMatcher = /^(ts|js)$/;

	const archetypeFlavours: JsonMatcherFrom<PackageArchetype>[] = [
		{ language: languageMatcher, platform: 'web', framework: not(contains('svelte')) },
		{ language: languageMatcher, platform: 'node', framework: not(contains('svelte')) },
		{ language: languageMatcher, platform: undefined, framework: undefined },
	];

	return {
		name: packageJson.name,
		elements: [
			{
				description: 'copy workspace root ts config',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
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
						'lint:tsc': 'turbo run lint:tsc_ --concurrency 16',
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
						'lint:tsc': 'turbo run lint:tsc_ --concurrency 16 --filter ${packageName}',
						'lint:tsc_': 'tsc --noEmit',
					},
				},
			},
			{
				description: 'add workspace dependency for the ts configs',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					devDependencies: {
						'@alexaegis/ts': `^${packageJson.version}`,
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
					name: not(
						or(
							equal('@alexaegis/ts'),
							equal('@alexaegis/vite'),
							equal('@alexaegis/vitest'),
							equal('@alexaegis/eslint-config-vitest'),
						),
					), // Don't add a dependency for itself, and other packages where it would result in a circle
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
						framework: or(equal('node'), equal('svelte')),
					},
				},
				data: {
					devDependencies: {
						'@types/node': packageJson.devDependencies['@types/node'],
					},
				},
			},

			...archetypeFlavours.map<AutotoolElementFileCopy>((archetype) => {
				const flavour = getEncodedArchetype(archetype) || 'node';

				return {
					description: `copy tsconfig for ${flavour} packages`,
					executor: 'fileCopy',
					packageKind: 'regular',
					formatWithPrettier: true,
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
