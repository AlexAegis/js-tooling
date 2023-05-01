import {
	getAssumedFinalInstallLocationOfPackage,
	normalizeSetupPluginOptions,
	type SetupElement,
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
				name: 'copy workspace root ts config',
				type: 'file-copy',
				packageKind: 'root',
				targetFile: 'tsconfig.json',
				sourceFile: join(packageDirectory, 'static', 'workspace-tsconfig.json'),
			},
			{
				name: 'add workspace root ts scripts',
				type: 'json',
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
				name: 'add package ts scripts',
				type: 'json',
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
				name: 'remove unnecessary tsconfig files',
				type: 'file-remove',
				globPattern: 'tsconfig.!(json)',
			},
			{
				name: 'add @types/node as a devDependency',
				type: 'json',
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
			...['base', 'web', 'svelte', 'node'].map<SetupElement>((flavour) => ({
				name: `copy tsconfig for ${flavour} packages`,
				type: 'file-copy',
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
