import type { JsonMatcherFrom } from '@alexaegis/object-match';
import type { PackageJson } from '@alexaegis/workspace-tools';

/**
 * The archetypical description of a project present in the "archetype" field
 * of the package.json. It's not the full description as other package.json
 * fields can be read, most notably the "private" field dictates if a package
 * is to be published or not. That information is not duplicated.
 *
 * private,published
 * app,lib => KIND
 * node, svelte, angular => RUNTIME/FRAMEWORK ?
 * ts? => LANG
 *
 * node-app
 * node-lib
 * svelte-app
 * svelte-lib
 * angular-app
 * angular-lib
 *
 */
export interface Archetype {
	/**
	 * @example 'typescript' | 'javascript'
	 */
	language?: string;

	/**
	 * @example 'node' | 'svelte' | 'angular'
	 */
	framework: string;

	kind: 'app' | 'lib';

	/**
	 * You can disable specific setup plugins if you wish to skip them in a
	 * specific package, even if it would otherwise match the rest of the
	 * archetype.
	 *
	 * Like define `["vitest"]` if you don't want it to be applied.
	 *
	 * Treated as a RegExp
	 */
	disabledPlugins?: string[];
}

export type PackageJsonFilter = JsonMatcherFrom<PackageJson & { archetype?: Archetype }>;
