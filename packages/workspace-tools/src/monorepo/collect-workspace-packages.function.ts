import { asyncFilterMap } from '@alexaegis/common';
import { readJson } from '@alexaegis/fs';
import { match } from '@alexaegis/match';
import { globby } from 'globby';
import { join, relative } from 'node:path';
import { getRootPackageJson } from '../npm/get-root-package-json.function.js';
import {
	NODE_MODULES_DIRECTORY_NAME,
	PACKAGE_JSON_NAME,
	type PackageJson,
} from '../package-json/package-json.interface.js';
import {
	normalizeCollectWorkspacePackagesOptions,
	type CollectWorkspacePackagesOptions,
} from './collect-workspace-packages.function.options.js';
import type { RegularWorkspacePackage, WorkspacePackage } from './workspace-package.interface.js';

export const collectWorkspacePackages = async (
	rawOptions?: CollectWorkspacePackagesOptions,
): Promise<WorkspacePackage[]> => {
	const options = normalizeCollectWorkspacePackagesOptions(rawOptions);

	const rootPackage = await getRootPackageJson(options);

	if (!rootPackage) {
		options.logger.error('No package json was found! Cannot collect workspace packages!');

		return [];
	}

	let result: WorkspacePackage[] = [];

	if (rootPackage.workspacePackagePatterns.length > 0) {
		const paths = await globby(rootPackage.workspacePackagePatterns, {
			gitignore: true,
			onlyDirectories: true,
			ignore: [NODE_MODULES_DIRECTORY_NAME],
			absolute: true,
			cwd: rootPackage.packagePath,
		});

		const subPackages = await asyncFilterMap(paths, (path) => {
			const packageJsonPath = join(path, PACKAGE_JSON_NAME);
			return readJson<PackageJson>(packageJsonPath)
				.catch(() => undefined)
				.then((packageJson) =>
					packageJson
						? ({
								packageKind: 'regular',
								packageJson,
								packagePath: path,
								packagePathFromRootPackage: relative(rootPackage.packagePath, path),
								packageJsonPath,
							} as RegularWorkspacePackage)
						: undefined,
				);
		});

		if (!options.onlyWorkspaceRoot) {
			result.push(...subPackages);
		}
	}

	// The root package is only accounted for if it's not skipped OR it's not a monorepo!
	if (!options.skipWorkspaceRoot || rootPackage.workspacePackagePatterns.length === 0) {
		result.unshift(rootPackage);
	}

	if (options.packageJsonMatcher) {
		result = result.filter((relativePackage) =>
			match(relativePackage.packageJson, options.packageJsonMatcher),
		);
	}

	if (options.dependencyCriteria.length > 0) {
		result = result.filter((relativePackage) => {
			const packageDependencies = [
				...Object.keys(relativePackage.packageJson.dependencies ?? {}),
				...Object.keys(relativePackage.packageJson.devDependencies ?? {}),
			];

			return options.dependencyCriteria.every((dependencyCriteria) =>
				packageDependencies.some((dependency) => dependencyCriteria.test(dependency)),
			);
		});
	}

	return result;
};
