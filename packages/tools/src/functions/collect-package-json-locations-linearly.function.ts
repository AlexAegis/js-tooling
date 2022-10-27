import { existsSync } from 'node:fs';
import { join, normalize } from 'node:path';

export const packageJsonName = 'package.json';

export const collectPackageJsonLocationsLinearly = (
	rawPath: string,
	collection: string[] = []
): string[] => {
	const path = normalize(rawPath);
	if (existsSync(join(path, packageJsonName))) {
		collection.unshift(path);
	}

	const parentPath = join(path, '..');
	if (parentPath !== path) {
		return collectPackageJsonLocationsLinearly(parentPath, collection);
	}
	return collection;
};
