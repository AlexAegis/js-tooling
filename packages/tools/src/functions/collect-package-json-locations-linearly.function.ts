import { existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

export const packageJsonName = 'package.json';

export const collectPackageJsonLocationsLinearly = (
	cwd: string = process.cwd(),
	collection: string[] = []
): string[] => {
	const path = normalize(cwd);
	if (existsSync(join(path, packageJsonName))) {
		collection.unshift(path);
	}

	const parentPath = join(path, '..');
	if (parentPath !== path) {
		return collectPackageJsonLocationsLinearly(parentPath, collection);
	}
	return collection;
};
