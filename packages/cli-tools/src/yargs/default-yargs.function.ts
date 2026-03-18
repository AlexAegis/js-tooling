import type { PackageJson } from '@alexaegis/workspace-tools';
import type { Argv } from 'yargs';

/**
 *  Automatically fills version, epiloge, help and completion
 */
export const defaultYargsFromPackageJson =
	(packageJson?: PackageJson) =>
	<T>(yarguments: Argv<T>) => {
		let yargs: Argv<T> = yarguments.help().completion();

		if (packageJson) {
			if (packageJson.version) {
				yargs = yargs.version(packageJson.version);
			}

			let repositoryUrl: string | undefined;

			if (typeof packageJson.repository === 'string') {
				repositoryUrl = packageJson.repository;
			} else if (packageJson.repository && typeof packageJson.repository.url === 'string') {
				repositoryUrl = packageJson.repository.url;
			}

			if (packageJson.name && packageJson.version && repositoryUrl) {
				yargs = yargs.epilogue(
					`${packageJson.name}@${packageJson.version} see project at ${repositoryUrl}`,
				);
			}
		}

		return yargs;
	};
