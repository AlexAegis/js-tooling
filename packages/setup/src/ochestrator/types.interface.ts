import type {
	SetupElement,
	SetupElementUniqueKind,
	SetupElementWithMetadata,
	SetupElementWithSourcePlugin,
	SourcePluginInformation,
} from '@alexaegis/setup-plugin';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';

export type AlreadyFilteredSetupElement = Omit<SetupElement, 'packageJsonFilter' | 'packageKind'>;

export type WorkspacePackageWithElements = WorkspacePackage & {
	elements: SetupElementWithSourcePlugin[];
};

export interface TargetNormalizedElement {
	element: SetupElementWithMetadata;
	targetFiles: string[];
}

export type WorkspacePackageWithTargetedElements = WorkspacePackage & {
	targetedElements: TargetNormalizedElement[];
	untargetedElements: (SetupElementUniqueKind & SourcePluginInformation)[];
};

export type WorkspacePackageElementsByTarget = WorkspacePackage & {
	targetedElements: Record<string, SetupElementWithMetadata[]>;
	untargetedElements: (SetupElementUniqueKind & SourcePluginInformation)[];
};

/**
 * TODO: remove this, use core
 */
export type ItemOf<T extends readonly unknown[]> = T extends readonly (infer R)[] ? R : never;
