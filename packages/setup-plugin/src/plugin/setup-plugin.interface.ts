import type { PackageJsonFilter } from './archetype.interface.js';
import type { PackageKind, SetupElement } from './setup-element.interface.js';

export interface SetupPluginFilter {
	/**
	 * Conditionally apply all elements based on the contents of the target
	 * package.
	 *
	 * You can also set this at the element level.
	 */
	packageJsonFilter?: PackageJsonFilter | undefined;

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
	packageKind?: PackageKind | undefined;
}

export interface SetupPlugin extends SetupPluginFilter {
	/**
	 * Name of the plugin, used for logging.
	 */
	name: string;

	/**
	 * Some elements like JSON properties and files are treated as templates.
	 * Values defined as `${key}` will be replaced if a variable here is found
	 * with the same name.
	 *
	 * Can also be defined per element, will overwrite plugin level variables.
	 */
	templateVariables?: Record<string | number, string> | undefined;

	elements: SetupElement[];
}
