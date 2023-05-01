import type { SetupElementWithMetadata } from '@alexaegis/setup-plugin';
import { normalizeSetupElementTargets } from '../normalize-setup-element-target.function.js';
import type {
	WorkspacePackageElementsByTarget,
	WorkspacePackageWithElements,
} from '../types.interface.js';

export const groupElementsByTargetFile = async (
	workspacePackage: WorkspacePackageWithElements
): Promise<WorkspacePackageElementsByTarget> => {
	const n = await normalizeSetupElementTargets(workspacePackage);
	return {
		...n,
		targetedElements: n.targetedElements.reduce<Record<string, SetupElementWithMetadata[]>>(
			(groups, next) => {
				for (const targetFile of next.targetFiles) {
					groups[targetFile]?.push(next.element);

					if (!groups[targetFile]) {
						groups[targetFile] = [next.element];
					}
				}

				return groups;
			},
			{}
		),
	};
};
