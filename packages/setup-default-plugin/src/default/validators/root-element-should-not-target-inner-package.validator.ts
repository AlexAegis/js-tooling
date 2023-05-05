import type { SetupElementError, WorkspacePackageElementsByTarget } from '@alexaegis/setup-plugin';
import { minimatch } from 'minimatch';

/**
 * Checks for conflicts in the collected setup elements for all targets
 */
export const verifyPackageSetupElements = (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget
): SetupElementError[] => {
	const errors = [];

	if (workspacePackageElementsByTarget.workspacePackage.packageKind === 'root') {
		// TODO: Detect this in a dedicated function and test it!
		// TODO: Add verifications to the plugins too!
		const workspacePackagePatterns =
			workspacePackageElementsByTarget.workspacePackage.workspacePackagePatterns;
		const elementsTargetingInsideAPackage = Object.entries(
			workspacePackageElementsByTarget.targetedElementsByFile
		).flatMap(([target, elements]) =>
			workspacePackagePatterns
				.filter((pattern) => minimatch(target, pattern))
				.flatMap(() => elements)
				.map((element) => ({ element, target }))
		);

		if (elementsTargetingInsideAPackage.length > 0) {
			errors.push(
				...elementsTargetingInsideAPackage.map<SetupElementError>(
					(elementTargetingInsideAPackage) => ({
						type: 'ETRYINGTOMODIFYPKGFROMROOT',
						message: 'A workspace level element tries to modify a a sub-package!',
						workspacePackage: workspacePackageElementsByTarget.workspacePackage,
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
