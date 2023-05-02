import type { InternalSetupElement } from '@alexaegis/setup-plugin';
import type { ExecutorMap } from '../executor-map.type.js';
import { normalizeSetupElementTargets } from '../normalize-setup-element-target.function.js';
import type {
	WorkspacePackageElementsByTarget,
	WorkspacePackageWithElements,
} from '../types.interface.js';
import { consolidateSetupElements } from './consolidate-elements.function.js';
import { mapRecord } from './map-record.function.js';

export const groupAndConsolidateElementsByTargetFile = async (
	workspacePackage: WorkspacePackageWithElements,
	executorMap: ExecutorMap
): Promise<WorkspacePackageElementsByTarget> => {
	const resolved = await normalizeSetupElementTargets(workspacePackage);
	const targetedElementsByFile = resolved.targetedElements.reduce<
		Record<string, InternalSetupElement[]>
	>((groups, next) => {
		for (const targetFile of next.resolvedTargetFiles) {
			groups[targetFile]?.push(next.element);

			if (!groups[targetFile]) {
				groups[targetFile] = [next.element];
			}
		}

		return groups;
	}, {});

	return {
		workspacePackage: resolved.workspacePackage,
		untargetedElements: resolved.untargetedElements,
		targetedElementsByFile: mapRecord(targetedElementsByFile, (elements) =>
			consolidateSetupElements(elements, executorMap)
		),
	};
};
