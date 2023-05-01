import { NODE_MODULES_DIRECTORY_NAME } from '@alexaegis/workspace-tools';
import { join } from 'node:path';
import type { BaseSetupPluginOptions } from './setup-plugin.options.js';

export const getAssumedFinalInstallLocationOfPackage = (
	options: BaseSetupPluginOptions,
	packageJson: { name: string }
): string => {
	return join(options.workspaceRoot, NODE_MODULES_DIRECTORY_NAME, ...packageJson.name.split('/'));
};
