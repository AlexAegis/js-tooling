import { asyncFilterMap } from '@alexaegis/common';
import {
	isDirectlyTargetedElement,
	isGlobTargetedElement,
	isMultiTargetedElement,
	isTargetedElement,
	isUntargetedElementWithSourceInformation,
} from '@alexaegis/setup-plugin';
import { globby } from 'globby';
import type {
	TargetNormalizedElement,
	WorkspacePackageWithElements,
	WorkspacePackageWithTargetedElements,
} from './types.interface.js';

export const normalizeSetupElementTargets = async (
	workspacePackage: WorkspacePackageWithElements
): Promise<WorkspacePackageWithTargetedElements> => {
	const untargetedElements = workspacePackage.elements.filter(
		isUntargetedElementWithSourceInformation
	);
	const targetedElements = workspacePackage.elements.filter(isTargetedElement);

	const elements = await asyncFilterMap(targetedElements, async (element) => {
		const targetFiles: string[] = [];

		if (isDirectlyTargetedElement(element)) {
			targetFiles.push(element.targetFile);
		}

		if (isGlobTargetedElement(element)) {
			const matchedFiles = await globby(element.globPattern, {
				cwd: workspacePackage.packagePath,
			});

			targetFiles.push(...matchedFiles);
		}

		if (isMultiTargetedElement(element)) {
			targetFiles.push(...element.targetFiles);
		}

		return { element, targetFiles: [...new Set(targetFiles)] } as TargetNormalizedElement;
	});

	return {
		...workspacePackage,
		targetedElements: elements,
		untargetedElements,
	};
};
