import type { InternalSetupElement, SetupElementError, SetupPlugin } from '@alexaegis/setup-plugin';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';

export interface PackageSetupElementErrorWithSourceData extends SetupElementError {
	target: string;
	workspacePackage: WorkspacePackage;
	sourcePlugins: SetupPlugin[];
	sourceElements: InternalSetupElement[];
}
