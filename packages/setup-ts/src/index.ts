import {
	getAssumedFinalInstallLocationOfPackage,
	normalizeSetupPluginOptions,
	type SetupElementFileCopy,
	type SetupPlugin,
	type SetupPluginOptions,
} from '@alexaegis/setup-plugin';
import { join } from 'node:path';
import packageJson from '../package.json';

export const tsSetupPlugin = (rawOptions: SetupPluginOptions): SetupPlugin | undefined => {
	const options = normalizeSetupPluginOptions(rawOptions);
	const logger = options.logger.getSubLogger({ name: 'ts' });
	const packageDirectory = getAssumedFinalInstallLocationOfPackage(options, packageJson);

	logger.info('loading...');

	return {
		name: 'ts',
		elements: [
			{
				description: 'copy workspace root ts config',
				executor: 'file-copy',
				packageKind: 'root',
				targetFile: 'tsconfig.json',

				sourceFile: join(packageDirectory, 'static', 'workspace-tsconfig.json'),
			},
			{
				description: 'add workspace root ts scripts',
				executor: 'package-json',
				packageKind: 'root',
				targetFile: 'package.json',
				packageJsonFilter: {
					keywords: (keywords) => keywords.includes(packageJson.name),
				},
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
				executor: 'package-json',
				packageKind: 'regular',
				targetFile: 'package.json',
				packageJsonFilter: {
					keywords: (keywords) => keywords.includes(packageJson.name),
				},
				data: {
					scripts: {
						'lint:tsc':
							'turbo run lint:tsc_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						'lint:tsc_': 'tsc --noEmit',
					},
					devDependencies: {
						'@alexaegis/ts': `^${packageJson.version}`,
					},
				},
			},
			{
				description: 'remove unnecessary tsconfig files',
				executor: 'file-remove',
				targetFilePatterns: 'tsconfig.!(json)',
			},
			{
				description: 'add @types/node as a devDependency',
				executor: 'package-json',
				packageKind: 'regular',
				targetFile: 'package.json',
				packageJsonFilter: {
					keywords: (keywords) => keywords.includes(`${packageJson.name}-node`),
				},
				data: {
					devDependencies: {
						'@types/node': packageJson.devDependencies['@types/node'],
					},
				},
			},
			...['base', 'web', 'svelte', 'node'].map<SetupElementFileCopy>((flavour) => ({
				name: `copy tsconfig for ${flavour} packages`,
				executor: 'file-copy',
				packageKind: 'regular',
				targetFile: 'tsconfig.json',
				packageJsonFilter: {
					keywords: (keywords) => keywords.includes(`${packageJson.name}-${flavour}`),
				},
				sourceFile: join(packageDirectory, 'static', 'package-simple-tsconfig.json'),
				templateVariables: {
					flavour,
				},
			})),
		],
	};
};
