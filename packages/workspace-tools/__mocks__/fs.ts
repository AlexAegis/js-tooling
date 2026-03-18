import type { PathLike } from 'node:fs';
import { join } from 'node:path/posix';
import { vi } from 'vitest';

import { PACKAGE_JSON_NAME } from '../src/package-json/package-json.interface.js';

export const mockProjectRoot = '/foo/bar';
const GITIGNORE_FILENAME = '.gitignore';

export const existsSync: ReturnType<typeof vi.fn<(_: PathLike) => boolean>> = vi.fn(
	(path: PathLike) => {
		const workspaceFiles = new Set([
			join(mockProjectRoot, 'packages/zed', PACKAGE_JSON_NAME),
			join(mockProjectRoot, 'packages/zed', GITIGNORE_FILENAME),
			join(mockProjectRoot, 'packages/zed/rcfile'),
			join(mockProjectRoot, 'packages/zod', PACKAGE_JSON_NAME),
			join(mockProjectRoot, 'packages/zod/rcfile'),
			join(mockProjectRoot, 'packages/rcfile'),
			join(mockProjectRoot, 'packages/nonfile'),
			join(mockProjectRoot, PACKAGE_JSON_NAME),
			join(mockProjectRoot, 'readme.md'),
			join(mockProjectRoot, GITIGNORE_FILENAME),
			join('/', GITIGNORE_FILENAME),
		]);

		return workspaceFiles.has(path.toString());
	},
);
