import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { lstatSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { packageJsonName } from './collect-package-json-locations-linearly.function.js';

export const readPackageJson = async (packagePath: string): Promise<PackageJson | undefined> => {
	if (!packagePath.endsWith(packageJsonName)) {
		packagePath = join(packagePath, packageJsonName);
	}
	if (lstatSync(packagePath, { throwIfNoEntry: false })?.isFile() ?? false) {
		const rawPackageJson = await readFile(packagePath, {
			encoding: 'utf8',
		});
		return JSON.parse(rawPackageJson);
	} else {
		return undefined;
	}
};
