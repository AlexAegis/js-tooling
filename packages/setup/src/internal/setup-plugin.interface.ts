import type { JsonMatcher } from '@alexaegis/object-match';

export interface SetupElementBase {
	/**
	 * An additional filter on top the plugin level filter. Both has to
	 * match in order for the element to be applied. (Remember, deprecated
	 * elements ALWAYS match, and they are ALWAYS removed!)
	 */
	packageJsonFilter?: JsonMatcher;

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

export interface SetupElementFileKind {
	kind: 'file';
}

export interface SetupElementJsonKind {
	kind: 'json';
}

export interface SetupElementUniqueKind {
	kind: 'unique';
	/**
	 * How an element should be applied to a target package
	 */
	apply: () => Promise<void>;
	/**
	 * How an element should be removed from a target package
	 */
	remove: () => Promise<void>;
}

export type SetupElement = SetupElementFileKind | SetupElementJsonKind | SetupElementUniqueKind;

export type SetupElementKind = SetupElement['kind'];

export interface SetupPlugin {
	packageJsonFilter?: JsonMatcher;
	elements: SetupElement[];
}
