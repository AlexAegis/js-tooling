import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { packageJsonName } from './collect-package-json-locations-linearly.function.js';

export const readPackageJson = async (
	path: string | undefined
): Promise<PackageJson | undefined> => {
	if (path === undefined) {
		return undefined;
	}

	if (!path.endsWith(packageJsonName)) {
		path = join(path, packageJsonName);
	}

	const rawPackageJson = await readFile(path, {
		encoding: 'utf8',
	}).catch(() => undefined);
	return rawPackageJson ? JSON.parse(rawPackageJson) : undefined;
};
