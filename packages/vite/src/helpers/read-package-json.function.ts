import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { PackageJson } from './package-json.type.js';

const packageJsonName = 'package.json';

export const readPackageJson = async (path: string): Promise<PackageJson | undefined> => {
	if (!path.endsWith(packageJsonName)) {
		path = join(path, packageJsonName);
	}
	const rawPackageJson = await readFile(path, {
		encoding: 'utf8',
	}).catch(() => undefined);
	return rawPackageJson ? JSON.parse(rawPackageJson) : undefined;
};
