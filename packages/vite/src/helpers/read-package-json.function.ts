import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { existsSync, readFileSync, statSync } from 'node:fs';

export const readPackageJson = (path: string): PackageJson | undefined => {
	if (existsSync(path) && statSync(path).isFile()) {
		const rawPackageJson = readFileSync(path, {
			encoding: 'utf8',
		});
		return JSON.parse(rawPackageJson) as PackageJson;
	} else {
		return undefined;
	}
};
