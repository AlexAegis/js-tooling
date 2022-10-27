import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { packageJsonName } from './collect-package-json-locations-linearly.function.js';

export const readPackageJsonSync = (packagePath: string): PackageJson | undefined => {
	const packageJsonLocation = join(packagePath, packageJsonName);
	if (existsSync(packageJsonLocation)) {
		const rawPackageJson = readFileSync(join(packagePath, packageJsonName), {
			encoding: 'utf8',
		});
		return JSON.parse(rawPackageJson);
	} else {
		return undefined;
	}
};
