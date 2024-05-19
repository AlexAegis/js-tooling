import packageJson from '@alexaegis/autotool-plugin-github/package.json' assert { type: 'json' };
import { type AutotoolPlugin, type AutotoolPluginObject } from 'autotool-plugin';
import { join } from 'node:path';

export const plugin: AutotoolPlugin = (_options): AutotoolPluginObject => {
	return {
		name: packageJson.name,
		elements: [
			{
				description: 'github bug_report.yml file',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: join('.github', 'ISSUE_TEMPLATE', 'bug_report.yml'),
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'bug_report.yml'),
			},
			{
				description: 'github feature_request.yml file',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: join('.github', 'ISSUE_TEMPLATE', 'feature_request.yml'),
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'feature_request.yml'),
			},
			{
				description: 'github funding.yml file',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: join('.github', 'funding.yml'),
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'funding.yml'),
			},
			{
				description: 'github cicd.yml file',
				executor: 'fileCopy',
				packageKind: 'root',
				targetFile: join('.github', 'workflows', 'cicd.yml'),
				sourcePluginPackageName: packageJson.name,
				sourceFile: join('static', 'cicd.yml'),
			},
		],
	};
};

export default plugin;
