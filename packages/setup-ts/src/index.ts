import {
	normalizeSetupPluginOptions,
	type SetupElement,
	type SetupPlugin,
	type SetupPluginOptions,
} from '@alexaegis/setup-plugin';
import { NODE_MODULES_DIRECTORY_NAME } from '@alexaegis/workspace-tools';
import { join } from 'node:path';
import packageJson from '../package.json';

export const tsSetupPlugin = (rawOptions: SetupPluginOptions): SetupPlugin | undefined => {
	const options = normalizeSetupPluginOptions(rawOptions);
	const logger = options.logger.getSubLogger({ name: 'ts' });
	logger.info('loading...');

	const packageDirectory = join(
		options.workspaceRoot,
		NODE_MODULES_DIRECTORY_NAME,
		...packageJson.name.split('/')
	);

	return {
		name: 'ts',
		elements: [
			{
				type: 'file-copy',
				packageKind: 'workspace',
				targetFile: 'tsconfig.json',
				sourceFile: join(packageDirectory, 'static', 'workspace-tsconfig.json'),
			},
			{
				type: 'json',
				packageKind: 'workspace',
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
				type: 'file-remove',
				globPattern: 'tsconfig.!(json)',
			},
			{
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
