import type { InternalSetupElement } from '@alexaegis/setup-plugin';
import type { ExecutorMap } from '../executor-map.type.js';

/**
 * Returns a smaller list of elements if their executor can consolidate them
 */
export const consolidateSetupElements = (
	elements: InternalSetupElement[],
	executorMap: ExecutorMap
): InternalSetupElement[] => {
	return [...executorMap.values()].flatMap((executor) => {
		const elementsOfExecutor = elements.filter((element) => element.executor === executor.type);
		return executor.consolidate ? executor.consolidate(elementsOfExecutor) : elementsOfExecutor;
	});
};
