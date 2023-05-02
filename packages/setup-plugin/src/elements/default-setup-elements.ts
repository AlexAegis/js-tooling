import type { SetupElementFileCopy } from './file-copy-element.js';
import type { SetupElementFileRemove } from './file-remove-element.js';
import type { SetupElementFileSymlink } from './file-symlink-element.js';
import type { SetupElementJson } from './json.element.js';

export type DefaultSetupElements =
	| SetupElementFileCopy
	| SetupElementFileSymlink
	| SetupElementFileRemove
	| SetupElementJson;
