import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import packageJson from '../package.json' with { type: 'json' };

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
						publint: "BUILD_REASON='publish' turbo run publint_ --concurrency 16",
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
							"BUILD_REASON='publish' turbo run publint_ --concurrency 16 --filter ${packageName}",
						publint_: 'publint dist',
					},
					devDependencies: {
						publint: packageJson.devDependencies.publint,
					},
				},
			},
			{
				description:
					'remove package publint command and scripts for private packages in case they got there somehow',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					private: true,
				},
				data: {
					scripts: {
						publint: undefined,
						publint_: undefined,
					},
					devDependencies: {
						publint: undefined,
					},
				},
			},
		],
	};
};

export default plugin;
