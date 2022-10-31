import type { JSONSchemaForNPMPackageJsonFiles as PackageJson } from '@schemastore/package';
import { readFileSync } from 'node:fs';
import { existsFile } from './exists-file.function.js';

export const readPackageJson = (path: string): PackageJson | undefined => {
	if (existsFile(path)) {
		const rawPackageJson = readFileSync(path, {
			encoding: 'utf8',
		});
		return JSON.parse(rawPackageJson) as PackageJson;
	} else {
		return undefined;
	}
};
