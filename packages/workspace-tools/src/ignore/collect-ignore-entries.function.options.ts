import type { Defined } from '@alexaegis/common';
import {
	normalizeCollectFileDirnamesUpDirectoryTreeOptions,
	type CollectFileDirnamesUpDirectoryTreeOptions,
} from '../npm/collect-file-dirname-paths-up-directory-tree.function.options.js';

export const GITIGNORE_FILENAME = '.gitignore';

export type CollectIgnoreEntriesOptions = CollectFileDirnamesUpDirectoryTreeOptions & {
	ignoreFileName?: string | undefined;
};

export type NormalizedCollectIgnoreEntriesOptions = Defined<CollectIgnoreEntriesOptions>;

export const normalizeCollectIgnoreEntriesOptions = (
	options?: CollectIgnoreEntriesOptions,
): NormalizedCollectIgnoreEntriesOptions => {
	return {
		...normalizeCollectFileDirnamesUpDirectoryTreeOptions(options),
		ignoreFileName: options?.ignoreFileName ?? GITIGNORE_FILENAME,
	};
};
