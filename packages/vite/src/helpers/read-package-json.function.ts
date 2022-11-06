import { readFile } from 'node:fs/promises';
import type { PackageJson } from './package-json.type.js';

export const readPackageJson = async (path: string): Promise<PackageJson | undefined> => {
	try {
		const rawPackageJson = await readFile(path, {
			encoding: 'utf8',
		});
		return JSON.parse(rawPackageJson) as PackageJson;
	} catch {
		return undefined;
	}
};
