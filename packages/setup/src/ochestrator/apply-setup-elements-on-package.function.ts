import { applyFileCopyElement } from '../element/file-copy-element.function.js';
import { applyFileRemoveElement } from '../element/file-remove-element.function.js';
import { groupElementsByType } from './helpers/group-elements-by-type.function.js';
import type { NormalizedSetupOptions } from './setup.function.options.js';
import type { WorkspacePackageElementsByTarget } from './types.interface.js';

export const applySetupElementsOnPackage = async (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget,
	options: NormalizedSetupOptions
): Promise<void> => {
	options.logger.info(
		`processing elements targeting ${workspacePackageElementsByTarget.packagePath}`
	);
	// Todo: concurrency using Promise.allSettled

	for (const [relativeFilePath, elements] of Object.entries(
		workspacePackageElementsByTarget.targetedElements
	)) {
		const grouped = groupElementsByType(elements);

		for (const element of grouped['file-remove']) {
			await applyFileRemoveElement(element, relativeFilePath, options);
		}

		for (const element of grouped['file-copy']) {
			await applyFileCopyElement(element, relativeFilePath, options);
		}
	}
};
