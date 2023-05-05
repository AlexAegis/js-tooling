import type { SetupElement } from '../setup-element.interface.js';
import type { WorkspacePackageElementsByTarget } from '../workspace-package-elements-by-target.interface.js';
import type { SetupElementError } from './setup-element-error.interface.js';

/**
 * When returns a non-empty array, the validator will halt execution.
 */
export type SetupValidator<Element extends SetupElement<string> = SetupElement<string>> = (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget<Element>
) => SetupElementError[];
