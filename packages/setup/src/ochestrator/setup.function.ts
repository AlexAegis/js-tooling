import { asyncMap } from '@alexaegis/common';
import {
	type SetupElement,
	type SetupElementExecutor,
	type SetupPlugin,
	type SetupPluginOptions,
} from '@alexaegis/setup-plugin';
import { tsSetupPlugin } from '@alexaegis/setup-ts';
import { collectWorkspacePackages } from '@alexaegis/workspace-tools';
import {
	normalizeSetupOptions,
	type SetupOptions,
} from '../../../setup-plugin/src/plugin/setup.function.options.js';
import { executeSetupElementsOnPackage } from './execute-setup-elements-on-package.function.js';
import { filterElementsForPackage } from './helpers/filter-elements-for-package.function.js';
import { groupAndConsolidateElementsByTargetFile } from './helpers/group-elements-by-target-file.function.js';
import { reportSetupElementError } from './report-setup-element-error.function.js';
import { verifyPackageSetupElements } from './verify-package-setup-elements.function.js';

export const setup = async (rawOptions: SetupOptions): Promise<void> => {
	const options = normalizeSetupOptions(rawOptions);
	const logger = options.logger.getSubLogger({ name: 'setup' });

	// collect target packages
	const workspacePackages = await collectWorkspacePackages(options);
	const workspaceRootPackage = workspacePackages.find(
		(workspacePackage) => workspacePackage.packageKind === 'root'
	);

	if (!workspaceRootPackage) {
		logger.warn('cannot do setup, not in a workspace!');
		return;
	}

	const pluginOptions: SetupPluginOptions = {
		...options,
		workspaceRoot: workspaceRootPackage.packagePath,
	};

	// Load plugins
	// TODO: instead of having a fixed set of plugins, detect them
	const plugins: SetupPlugin[] = [];
	const tsPlugin = tsSetupPlugin(pluginOptions);

	if (tsPlugin) {
		plugins.push(tsPlugin);
	}

	const executorMap = plugins.reduce((executorMap, plugin) => {
		if (plugin.executors) {
			for (const executor of plugin.executors) {
				if (executorMap.has(executor.type)) {
					options.logger.warn(`Executor ${executor.type} already loaded!`);
				} else {
					executorMap.set(executor.type, executor);
				}
			}
		}
		return executorMap;
	}, new Map<string, SetupElementExecutor<SetupElement<string>>>());

	// Collect elements?

	const workspacePackagesWithElements = workspacePackages.map((workspacePackage) =>
		filterElementsForPackage(workspacePackage, plugins)
	);

	const workspacePackagesWithElementsByTarget = await asyncMap(
		workspacePackagesWithElements,
		(workspacePackageWithElements) =>
			groupAndConsolidateElementsByTargetFile(workspacePackageWithElements, executorMap)
	);

	console.log(workspacePackagesWithElementsByTarget);

	const errors = workspacePackagesWithElementsByTarget.flatMap((workspacePackageElements) =>
		verifyPackageSetupElements(workspacePackageElements, executorMap)
	);

	if (errors.length > 0) {
		logger.error('Error detected within setup elements!');
		for (const error of errors) {
			reportSetupElementError(error, options);
		}
		return undefined;
	}

	logger.info('Valid setup elements, proceeding');

	await Promise.allSettled(
		workspacePackagesWithElementsByTarget.map((workspacePackageElementsByTarget) =>
			executeSetupElementsOnPackage(workspacePackageElementsByTarget, executorMap, options)
		)
	);
};
