import type { JsonValue } from '@alexaegis/object-match';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';
import type { PackageJsonFilter } from './archetype.interface.js';

export type PackageKind = 'workspace' | 'regular' | 'both';

export interface SetupElementBase {
	/**
	 * 'workspace' means this will only be applied to the root package, the
	 * entire workspace. 'regular' means a normal package thats inside the
	 * workspace. The default 'both' setting will apply the element to both
	 * the entire workspace and all inner packages too.
	 *
	 * You can also set this at the plugin level.
	 *
	 * @default 'both'
	 */
	packageKind?: PackageKind | undefined;

	/**
	 * Conditionally apply the element based on the contents of the target
	 * package.
	 *
	 * You can also set this at the plugin level, both has to match in order
	 * for the element to be applied.
	 */
	packageJsonFilter?: PackageJsonFilter | undefined;

	/**
	 * Some elements like JSON properties and files are treated as templates.
	 * Values defined as `${key}` will be replaced if a variable here is found
	 * with the same name.
	 *
	 * Can also be defined on the plugin, but these  will take precedence over
	 * plugin level variables.
	 */
	templateVariables?: Record<string | number, string> | undefined;

	/**
	 * If an element is marked legacy it will always be removed, if you change
	 * an element where that change is not fully overlapping with the original
	 * element. For example if for a packageJson script element, you change its
	 * key, you have to remave the old one. In this case, don't just change the
	 * element, but create a new one and mark the old one as deprecated.
	 * With time, as a breaking change you can remove the deprecated elements
	 * once you know it's been applied everywhere, or just keep them around.
	 *
	 * @default false
	 */
	deprecated?: boolean | undefined;
}

export interface DirectlyTargetedElement {
	/**
	 * Only this file is affected
	 */
	targetFile: string;
}

export const isDirectlyTargetedElement = (element: unknown): element is DirectlyTargetedElement =>
	typeof (element as DirectlyTargetedElement).targetFile === 'string';

export const isGlobTargetedElement = (element: unknown): element is GlobTargetedElement =>
	typeof (element as GlobTargetedElement).globPattern === 'string' ||
	Array.isArray((element as GlobTargetedElement).globPattern);

export const isMultiTargetedElement = (element: unknown): element is MultiTargetedElement =>
	Array.isArray((element as MultiTargetedElement).targetFiles);

export interface GlobTargetedElement {
	/**
	 * All matching files are affected
	 */
	globPattern: string[] | string;
}

export interface MultiTargetedElement {
	/**
	 * All files are affected
	 */
	targetFiles: string[];
}

export interface SetupElementFileCopyKind extends SetupElementBase, DirectlyTargetedElement {
	type: 'file-copy';
	sourceFile: string;
}

export interface SetupElementFileSymlinkKind extends SetupElementBase, DirectlyTargetedElement {
	type: 'file-symlink';
	sourceFile: string;
}

/**
 * After all file distributions happen, these will transform said files.
 */
export interface SetupElementFileTransformKind extends SetupElementBase, DirectlyTargetedElement {
	type: 'file-transform';
	apply: (fileContent: string) => string;
	deapply: (fileContent: string) => string;
}

export interface SetupElementJsonKind extends SetupElementBase, DirectlyTargetedElement {
	/**
	 * Updates a json file, this means the target file needs to be JSON parsable.
	 */
	type: 'json';
	data: JsonValue;
}

export interface SetupElementUniqueKind extends SetupElementBase {
	type: 'unique';
	/**
	 * How an element should be applied to a target package
	 */
	apply: (workspacePackage: WorkspacePackage) => Promise<void>;
	/**
	 * How an element should be removed from a target package
	 */
	remove: (workspacePackage: WorkspacePackage) => Promise<void>;
}

export type TargetedSetupElement =
	| SetupElementJsonKind
	| SetupElementFileTransformKind
	| SetupElementFileRemoveKind
	| SetupElementFileSymlinkKind
	| SetupElementFileCopyKind;

export type UntargetedSetupElement = SetupElementUniqueKind;

export type SetupElement = TargetedSetupElement | UntargetedSetupElement;

export const isUntargetedElement = (element: SetupElement): element is UntargetedSetupElement =>
	element.type === 'unique';

export const isTargetedElement = (element: SetupElement): element is TargetedSetupElement =>
	!isUntargetedElement(element);

export interface SetupElementFileRemoveKind extends SetupElementBase, GlobTargetedElement {
	/**
	 * Removes the target file(s). Will conflict with 'file-copy' if you try to
	 * write and remove the same file.
	 */
	type: 'file-remove';
}

type OmitTargeting<T> = Omit<
	T,
	keyof DirectlyTargetedElement | keyof GlobTargetedElement | keyof MultiTargetedElement
>;

export type SetupElementWithoutTargeting =
	| OmitTargeting<SetupElementUniqueKind>
	| OmitTargeting<SetupElementJsonKind>
	| OmitTargeting<SetupElementFileTransformKind>
	| OmitTargeting<SetupElementFileRemoveKind>
	| OmitTargeting<SetupElementFileSymlinkKind>
	| OmitTargeting<SetupElementFileCopyKind>;
