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
	packageKind?: PackageKind;

	/**
	 * Conditionally apply the element based on the contents of the target
	 * package.
	 *
	 * You can also set this at the plugin level, both has to match in order
	 * for the element to be applied.
	 */
	packageJsonFilter?: PackageJsonFilter;

	/**
	 * Some elements like JSON properties and files are treated as templates.
	 * Values defined as `${key}` will be replaced if a variable here is found
	 * with the same name.
	 *
	 * Can also be defined on the plugin, but these  will take precedence over
	 * plugin level variables.
	 */
	templateVariables?: Record<string | number, string>;

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
	deprecated?: boolean;
}

export interface SetupElementFileCopyKind extends SetupElementBase {
	type: 'file-copy';
	targetFile: string;
	sourceFile: string;
}

export interface SetupElementFileSymlinkKind extends SetupElementBase {
	type: 'file-symlink';
	targetFile: string;
	sourceFile: string;
}

export interface SetupElementFileRemoveKind extends SetupElementBase {
	/**
	 * Removes the target file(s). Will conflict with 'file-copy' if you try to
	 * write and remove the same file.
	 */
	type: 'file-remove';

	/**
	 * Matching files are removed
	 */
	globPattern: string;
}

/**
 * After all file distributions happen, these will transform said files.
 */
export interface SetupElementFileTransformKind extends SetupElementBase {
	type: 'file-transform';
	targetFile: string;
	transform: (fileContent: string) => string;
}

export interface SetupElementJsonKind extends SetupElementBase {
	/**
	 * Updates a json
	 */
	type: 'json';
	/**
	 * Has to be JSON5 parseable. Will be re-formatted with prettier when available.
	 */
	targetFile: string;
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

export type SetupElement =
	| SetupElementJsonKind
	| SetupElementUniqueKind
	| SetupElementFileCopyKind
	| SetupElementFileSymlinkKind
	| SetupElementFileRemoveKind
	| SetupElementFileTransformKind;

export type SetupElementKind = SetupElement['type'];

export interface SetupPlugin {
	/**
	 * Name of the plugin, used for logging.
	 */
	name: string;

	/**
	 * Conditionally apply all elements based on the contents of the target
	 * package.
	 *
	 * You can also set this at the element level.
	 */
	packageJsonFilter?: PackageJsonFilter;

	/**
	 * 'workspace' means this will only be applied to the root package, the
	 * entire workspace. 'regular' means a normal package thats inside the
	 * workspace. The default 'both' setting will apply the plugin to both
	 * the entire workspace and all inner packages too.
	 *
	 * You can also set this at the element level.
	 *
	 * @default 'both'
	 */
	packageKind?: PackageKind;

	/**
	 * Some elements like JSON properties and files are treated as templates.
	 * Values defined as `${key}` will be replaced if a variable here is found
	 * with the same name.
	 *
	 * Can also be defined per element, will overwrite plugin level variables.
	 */
	templateVariables?: Record<string | number, string>;

	elements: SetupElement[];
}
