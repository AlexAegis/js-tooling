import type { WorkspacePackage } from '@alexaegis/workspace-tools';
import type { InternalSetupElement, SetupElement } from './setup-element.interface.js';

export interface WorkspacePackageElementsByTarget<
	Element extends SetupElement<string> = SetupElement<string>
> {
	workspacePackage: WorkspacePackage;
	targetedElementsByFile: Record<string, InternalSetupElement<Element>[]>;
	untargetedElements: InternalSetupElement<Element>[];
}
