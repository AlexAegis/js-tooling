import { objectMatch } from '@alexaegis/object-match';
import type { SetupPluginOptions } from '@alexaegis/setup-plugin';
import { tsSetupPlugin } from '@alexaegis/setup-ts';
import { getWorkspaceRoot } from '@alexaegis/workspace-tools';
import { normalizeSetupOptions, type SetupOptions } from './setup.function.options.js';

export const setup = (rawOptions: SetupOptions): void => {
	const options = normalizeSetupOptions(rawOptions);
	const logger = options.logger.getSubLogger({ name: 'setup' });

	// TODO: instead of having a fixed set of plugins, detect them

	const workspaceRoot = getWorkspaceRoot(options.cwd);

	if (!workspaceRoot) {
		logger.warn('cannot do setup, not in a workspace!');
		return;
	}

	const pluginOptions: SetupPluginOptions = { ...options, workspaceRoot };

	// Load plugins
	const tsPlugin = tsSetupPlugin(pluginOptions);

	console.log(tsPlugin);

	objectMatch({}, {});
	// Collect elements?
	// Consolidate elements based on target type
	// collect target packages
	// apply

	return undefined;
};
