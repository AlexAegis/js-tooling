import { asyncFilterMap } from '@alexaegis/common';
import { writeJson } from '@alexaegis/fs';

import { Pakk, type PakkOptions } from '@pakk/core';
import {
	normalizePakkStandaloneOptions,
	type PakkStandaloneOptions,
} from './pakk-standalone-runner.function.options.js';

/**
 * The standalone runner for pakk to be used on it's own instead of together
 * with a build tool
 */
export const pakkStandaloneRunner = async (
	rawOptions?: PakkOptions & PakkStandaloneOptions,
): Promise<void> => {
	const pakkStandaloneOptions = normalizePakkStandaloneOptions(rawOptions);
	const pakk = await Pakk.withContext(pakkStandaloneOptions, rawOptions);

	await pakk.examinePackage();

	await asyncFilterMap(pakk.getTargetPackageJsonKinds(), async (packageJsonTarget) => {
		const { updatedPackageJson, path } = await pakk.createUpdatedPackageJson(packageJsonTarget);

		await writeJson(updatedPackageJson, path, pakk.options);
	});
};
