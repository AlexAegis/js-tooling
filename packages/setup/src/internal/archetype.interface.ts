import type { JsonMatcher, JsonMatcherFrom } from '@alexaegis/object-match';

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
	 * You can disable specific setup elements if you wish to skip them.
	 * Like define `["vitest"]` if you don't want
	 *
	 */
	disabledElements?: string[];
}

export interface JsonFilterWithArchetypeFilter {
	archetype: JsonMatcherFrom<Archetype>;
	[K: string]: JsonMatcher | JsonMatcherFrom<Archetype>;
}
