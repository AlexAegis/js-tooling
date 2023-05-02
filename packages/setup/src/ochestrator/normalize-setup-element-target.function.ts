import { asyncFilterMap, isNotNullish } from '@alexaegis/common';
import { type InternalSetupElement } from '@alexaegis/setup-plugin';
import { globby } from 'globby';
import type {
	InternalSetupElementsWithResolvedTargets,
	WorkspacePackageWithElements,
	WorkspacePackageWithTargetedElements,
} from './types.interface.js';

const isElementTargeting = (element: InternalSetupElement): boolean => {
	return isNotNullish(element.targetFile) || isNotNullish(element.targetFilePatterns);
};

export const normalizeSetupElementTargets = async (
	workspacePackageWithElements: WorkspacePackageWithElements
): Promise<WorkspacePackageWithTargetedElements> => {
	const elementsWithTargeting = workspacePackageWithElements.elements.filter((element) =>
		isElementTargeting(element)
	);
	const elementsWithoutTargeting = workspacePackageWithElements.elements.filter(
		(element) => !isElementTargeting(element)
	);

	const elements = await asyncFilterMap(elementsWithTargeting, async (element) => {
		const targetFiles: string[] = [];

		if (element.targetFile) {
			if (typeof element.targetFile === 'string') {
				targetFiles.push(element.targetFile);
			} else {
				targetFiles.push(...element.targetFile);
			}
		}

		if (element.targetFilePatterns) {
			const matchedFiles = await globby(element.targetFilePatterns, {
				cwd: workspacePackageWithElements.workspacePackage.packagePath,
				dot: true,
				globstar: true,
				braceExpansion: true,
			});

			targetFiles.push(...matchedFiles);
		}

		return {
			element,
			resolvedTargetFiles: [...new Set(targetFiles)],
		} as InternalSetupElementsWithResolvedTargets;
	});

	return {
		...workspacePackageWithElements,
		targetedElements: elements,
		untargetedElements: elementsWithoutTargeting,
	};
};
