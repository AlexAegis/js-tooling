import packageJson from '@alexaegis/autotool-plugin-standard-version/package.json' assert { type: 'json' };
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'workspace standard-version scripts and devDependencies',
				executor: 'packageJson',
				packageKind: 'root',
				data: {
					scripts: {
						release: 'commit-and-tag-version --sign --commit-all',
						'release:patch':
							'commit-and-tag-version --sign --commit-all --release-as patch',
						'release:minor':
							'commit-and-tag-version --sign --commit-all --release-as minor',
						'release:major':
							'commit-and-tag-version --sign --commit-all --release-as major',
					},
					devDependencies: {
						'commit-and-tag-version':
							packageJson.dependencies['commit-and-tag-version'],
					},
				},
			},
			{
				description: 'workspace standard-version config file',
				executor: 'fileCopy',
				packageKind: 'root',
				formatWithPrettier: true,
				sourceFile: join('static', 'versionrc.cjs.txt'),
				targetFile: '.versionrc.cjs',
				sourcePluginPackageName: packageJson.name,
			},
		],
	};
};

export default plugin;
