import type { JsonValue } from '@alexaegis/object-match';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';
import type { PackageJsonFilter } from './package-json-filter.interface.js';
import type { SetupPlugin, SetupPluginElementPackageTargetKind } from './setup-plugin.interface.js';

export interface SetupElement<Executor extends string> {
	/**
	 * Type of the element, used identify the executor for it.
	 */
	executor: Executor;

	/**
	 * A description used for logging of what the element is doing.
	 *
	 * @example 'adding eslint scripts into packageJson'
	 */
	description?: string | undefined;

	/**
	 * You can define file(s) for an element to operate on.
	 *
	 * TODO: "autogenerated(?)" guardrail to not operate on unmanaged files
	 *
	 * You can also use `targetFilePatterns` if you want to use globs
	 * to target multiple existing files, for example if you want to remove
	 * multiple at once.
	 */
	targetFile?: string[] | string | undefined;

	/**
	 * Files mentioned here will only be targeted if they already exist!
	 * When `undefined` the element is treated "untargeted"
	 * and is not checked for conflicts.
	 *
	 * Both targetFile and targetFilePatterns
	 */
	targetFilePatterns?: string[] | string | undefined;

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
	packageKind?: SetupPluginElementPackageTargetKind | undefined;

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

	/**
	 * Do not use, will be overwritten
	 */
	workspacePackage?: never | undefined;

	/**
	 * Do not use, will be overwritten
	 */
	sourcePlugin?: never | undefined;
}

export interface SetupElementAdditionalMetadata {
	workspacePackage: WorkspacePackage;
	sourcePlugin: SetupPlugin;
}

export interface TargetedElementAdditionalMetadata {
	targetFile: string;
	workspacePackage: WorkspacePackage;
}

export type InternalSetupElement<Element extends SetupElement<string> = SetupElement<string>> =
	Omit<Element, 'workspacePackage' | 'sourcePlugin'> & SetupElementAdditionalMetadata;

export type TargetedElement<Element extends SetupElement<string> = SetupElement<string>> = Omit<
	InternalSetupElement<Element>,
	'targetFile'
> &
	TargetedElementAdditionalMetadata;

export interface SetupElementFileSymlinkKind extends SetupElement<'file-symlink'> {
	sourceFile: string;
}

/**
 * After all file distributions happen, these will transform said files.
 */
export interface SetupElementFileTransformKind extends SetupElement<'file-transform'> {
	apply: (fileContent: string) => string;
	deapply: (fileContent: string) => string;
}

/**
 * Updates a json file, this means the target file needs to be JSON parsable.
 */
export interface SetupElementJsonModify extends SetupElement<'json'> {
	data: JsonValue;
}

export interface SetupElementUniqueKind extends SetupElement<'unique'> {
	/**
	 * How an element should be applied to a target package
	 */
	apply: (workspacePackage: WorkspacePackage) => Promise<void>;
	/**
	 * How an element should be removed from a target package
	 */
	remove: (workspacePackage: WorkspacePackage) => Promise<void>;
}
