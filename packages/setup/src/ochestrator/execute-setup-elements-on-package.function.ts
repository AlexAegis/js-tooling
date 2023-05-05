import type { WorkspacePackageElementsByTarget } from '@alexaegis/setup-plugin';
import type { NormalizedSetupOptions } from '../../../setup-plugin/src/plugin/setup.function.options.js';
import type { ExecutorMap } from './executor-map.type.js';

/**
 * Targeted files are executed concurrently but elements targeting the same
 * file are executed sequentially to avoid data-loss if two elements want to
 * modify it.
 *
 * TODO: chainable/consolidateable elements like 'json' modifications to avoid writing multiple times, instead
 */
export const executeSetupElementsOnPackage = async (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget,
	executorMap: ExecutorMap,
	options: NormalizedSetupOptions
): Promise<void> => {
	options.logger.info(
		`processing elements targeting ${workspacePackageElementsByTarget.workspacePackage.packagePath}`
	);

	await Promise.allSettled(
		Object.entries(workspacePackageElementsByTarget.targetedElementsByFile).map(
			async ([targetFile, elements]) => {
				for (const element of elements) {
					const executor = executorMap.get(element.executor);

					if (executor) {
						options.logger.info(
							`Executing element${
								element.description ? ' "' + element.description : '" '
							} using ${executor.type} on ${targetFile}`
						);
						// TODO: handle dryness
						await executor.apply({ ...element, targetFile }, options);
					} else {
						throw new Error('Executor not found');
					}
				}
			}
		)
	);
};
