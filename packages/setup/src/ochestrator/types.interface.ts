import type { InternalSetupElement, SetupElement, SetupPlugin } from '@alexaegis/setup-plugin';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';

export type SetupElementWithSourcePlugin = SetupElement<string> & { sourcePlugin: SetupPlugin };
export interface WorkspacePackageWithElements {
	workspacePackage: WorkspacePackage;
	elements: InternalSetupElement[];
}

export interface InternalSetupElementsWithResolvedTargets {
	element: InternalSetupElement;
	resolvedTargetFiles: string[];
}

export interface WorkspacePackageWithTargetedElements {
	workspacePackage: WorkspacePackage;
	targetedElements: InternalSetupElementsWithResolvedTargets[];
	untargetedElements: InternalSetupElement[];
}

/**
 * TODO: remove this, use core
 */
export type ItemOf<T extends readonly unknown[]> = T extends readonly (infer R)[] ? R : never;
