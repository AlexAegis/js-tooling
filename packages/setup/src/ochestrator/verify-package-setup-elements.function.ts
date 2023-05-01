import type { SetupElementTypes, SetupElementWithMetadata } from '@alexaegis/setup-plugin';
import { minimatch } from 'minimatch';
import {
	SETUP_ERROR_MULTIPLE_COPIES,
	SETUP_ERROR_MULTIPLE_COPIES_AND_REMOVES,
	SETUP_ERROR_WORKSPACE_ELEMENT_TARGETING_INSIDE_PACKAGE,
	type PackageSetupElementError,
} from './setup-errors.js';
import type { WorkspacePackageElementsByTarget } from './types.interface.js';

/**
 * Checks for conflicts in the collected setup elements for all targets
 */
export const verifyPackageSetupElements = (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget
): PackageSetupElementError[] => {
	const errors = Object.entries(workspacePackageElementsByTarget.targetedElements).flatMap(
		([target, elementsOnATarget]) => {
			const elementsByType = elementsOnATarget.reduce<
				Record<SetupElementTypes, SetupElementWithMetadata[]>
			>(
				(groups, next) => {
					groups[next.type].push(next);
					return groups;
				},
				{
					'file-copy': [],
					'file-remove': [],
					'file-symlink': [],
					'file-transform': [],
					json: [],
					unique: [],
				}
			);

			const errors: PackageSetupElementError[] = [];

			if (elementsByType['file-copy'].length > 1) {
				errors.push({
					target,
					type: SETUP_ERROR_MULTIPLE_COPIES,
					message: 'More than one element tries to copy to the same place!',
					workspacePackage: workspacePackageElementsByTarget,
					sourceElements: elementsByType['file-copy'],
					sourcePlugins: elementsByType['file-copy'].flatMap(
						(element) => element.sourcePlugin
					),
				});
			}

			if (elementsByType['file-copy'].length + elementsByType['file-remove'].length > 1) {
				const erroredElements = [
					...elementsByType['file-copy'],
					...elementsByType['file-remove'],
				];
				errors.push({
					target,
					type: SETUP_ERROR_MULTIPLE_COPIES_AND_REMOVES,
					message: 'More than one element',
					workspacePackage: workspacePackageElementsByTarget,
					sourceElements: erroredElements,
					sourcePlugins: erroredElements.flatMap((element) => element.sourcePlugin),
				});
			}

			return errors;
		}
	);

	if (workspacePackageElementsByTarget.packageKind === 'root') {
		const elementsTargetingInsideAPackage = Object.entries(
			workspacePackageElementsByTarget.targetedElements
		).flatMap(([target, elements]) =>
			workspacePackageElementsByTarget.workspacePackagePatterns
				.filter((pattern) => minimatch(target, pattern))
				.flatMap(() => elements)
				.map((element) => ({ element, target }))
		);

		if (elementsTargetingInsideAPackage.length > 0) {
			errors.push(
				...elementsTargetingInsideAPackage.map<PackageSetupElementError>(
					(elementTargetingInsideAPackage) => ({
						type: SETUP_ERROR_WORKSPACE_ELEMENT_TARGETING_INSIDE_PACKAGE,
						message: 'A workspace level element tries to modify a a sub-package!',
						workspacePackage: workspacePackageElementsByTarget,
						target: elementTargetingInsideAPackage.target,
						sourceElements: [elementTargetingInsideAPackage.element],
						sourcePlugins: [elementTargetingInsideAPackage.element.sourcePlugin],
					})
				)
			);
		}
	}

	return errors;
};
