import { equal, not, or } from '@alexaegis/predicate';
import {
	type AutotoolPlugin,
	type AutotoolPluginObject,
	type NormalizedAutotoolPluginOptions,
} from 'autotool-plugin';
import packageJson from '../package.json' with { type: 'json' };

// Packages with standalone vite configs (no pakk) that can't use `publint dist`
const STANDALONE_PACKAGES = or(
	equal('@alexaegis/common'),
	equal('@alexaegis/eslint-config-vitest'),
	equal('@alexaegis/fs'),
	equal('@alexaegis/logging'),
	equal('@alexaegis/match'),
	equal('@alexaegis/predicate'),
	equal('@alexaegis/ts'),
	equal('@alexaegis/vitest'),
	equal('@alexaegis/workspace-tools'),
	equal('@pakk/cli'),
	equal('@pakk/core'),
	equal('vite-plugin-pakk'),
);

export const plugin: AutotoolPlugin = (
	_options: NormalizedAutotoolPluginOptions,
): AutotoolPluginObject => {
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
				description: 'package publint command and scripts for public pakk-built packages',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					private: false,
					name: not(STANDALONE_PACKAGES),
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
				description: 'package publint command and scripts for public standalone packages',
				executor: 'packageJson',
				packageKind: 'regular',
				packageJsonFilter: {
					private: false,
					name: STANDALONE_PACKAGES,
				},
				data: {
					scripts: {
						publint:
							"BUILD_REASON='publish' turbo run publint_ --concurrency 16 --filter ${packageName}",
						publint_: 'publint',
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
