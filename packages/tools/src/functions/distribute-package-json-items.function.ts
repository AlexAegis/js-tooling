import { join } from 'node:path';
import { deepMerge } from './deep-merge.function.js';
import { collectTargetedPackagePaths } from './distribute-file.function.js';
import {
	DistributeFileOptions,
	normalizeDistributeOptions,
} from './distribute-file.function.options.js';

import { readJson } from './read-json.function.js';
import { writeJson } from './write-json.function.js';

export const PACKAGE_JSON_FILENAME = 'package.json';

export const distributePackageJsonItems = async (
	file: Record<string | number, unknown>,
	rawOptions?: DistributeFileOptions
): Promise<void> => {
	const options = normalizeDistributeOptions(rawOptions);

	const targetPackages = await collectTargetedPackagePaths(options);

	const targets = await Promise.all(
		targetPackages
			.map((targetPackage) => join(targetPackage, PACKAGE_JSON_FILENAME))
			.map((path) =>
				readJson<Record<string | number, unknown>>(path).then((packageJson) => ({
					packageJson,
					path,
				}))
			)
	);

	if (options.dry) {
		options.logger.log('writing package.json files...');
		for (const target of targets) {
			options.logger.log(
				`writing ${target.path}'s new content: ${JSON.stringify(target.packageJson)}`
			);
		}
	} else {
		await Promise.all(
			targets.map((target) =>
				target.packageJson
					? writeJson(deepMerge(target.packageJson, file), target.path)
					: undefined
			)
		);
	}
};
