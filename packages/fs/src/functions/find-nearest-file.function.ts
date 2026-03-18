import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const findNearestFile = (
	fileName: string,
	relativeTo: string = process.cwd(),
): string | undefined => {
	let currentPath = relativeTo;
	for (;;) {
		if (existsSync(join(currentPath, fileName))) {
			return currentPath;
		}

		const parentPath = join(currentPath, '..');

		if (parentPath === currentPath) {
			break;
		}

		currentPath = parentPath;
	}

	return undefined;
};
