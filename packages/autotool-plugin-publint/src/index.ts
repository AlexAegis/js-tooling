import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import packageJson from '../package.json';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace publint scripts',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						publint: 'turbo run publint_ --concurrency 16 --cache-dir .cache/turbo',
					},
				},
			},
			{
				description: 'package publint command and scripts for public packages',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					private: false,
				},
				data: {
					scripts: {
						publint:
							'turbo run publint_ --concurrency 16 --cache-dir .cache/turbo --filter ${packageName}',
						publint_: 'publint dist',
					},
					devDependencies: {
						publint: packageJson.devDependencies.publint,
					},
				},
			},
		],
	};
};

export default plugin;