import type { InternalSetupElement, SetupPlugin } from '@alexaegis/setup-plugin';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';

export const SETUP_ERROR_MULTIPLE_COPIES = 'ESETUPMULTICOPY';
export const SETUP_ERROR_MULTIPLE_COPIES_AND_REMOVES = 'ESETUPMULTICOPYANDREMOVE';
export const SETUP_ERROR_WORKSPACE_ELEMENT_TARGETING_INSIDE_PACKAGE = 'ESETUPROOTINTOPACKAGE';

export type PackageSetupElementErrorTypes =
	| typeof SETUP_ERROR_MULTIPLE_COPIES
	| typeof SETUP_ERROR_MULTIPLE_COPIES_AND_REMOVES
	| typeof SETUP_ERROR_WORKSPACE_ELEMENT_TARGETING_INSIDE_PACKAGE;

export interface PackageSetupElementError {
	type: PackageSetupElementErrorTypes;
	target: string;
	message: string;
	workspacePackage: WorkspacePackage;
	sourcePlugins: SetupPlugin[];
	sourceElements: InternalSetupElement[];
}
