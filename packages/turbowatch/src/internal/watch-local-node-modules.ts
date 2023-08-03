import { isNotNullish, noopAsync } from '@alexaegis/common';
import {
	NODE_MODULES_DIRECTORY_NAME,
	collectIgnoreEntries,
	collectWorkspacePackages,
	getCurrentPackageRoot,
} from '@alexaegis/workspace-tools';
import { ChildProcess, spawn } from 'node:child_process';
import { join } from 'node:path';
import type { Expression } from 'turbowatch';
import {
	normalizeTurbowatchLocalNodeModulesOptions,
	type TurbowatchLocalNodeModulesOptions,
} from './watch-local-node-modules.options.js';

/**
 * how about relying on CWD, and do the whole thing from a package?
 */
export const turbowatchLocalNodeModules = async (
	rawOptions?: TurbowatchLocalNodeModulesOptions,
): Promise<Parameters<typeof import('turbowatch').watch>[0]> => {
	const options = normalizeTurbowatchLocalNodeModulesOptions(rawOptions);
	console.log('turbowatch started in', options.cwd);
	const currentPackagePath = getCurrentPackageRoot(options.cwd);
	if (!currentPackagePath) {
		throw new Error('Not in a package!');
	}

	const currentPackagesNodeModulesPath = join(currentPackagePath, NODE_MODULES_DIRECTORY_NAME);

	const workspacePackages = await collectWorkspacePackages({
		...options,
		skipWorkspaceRoot: true,
	});

	/**
	 * Pakk modifies it on build, as it's not part of the source code, and is
	 * actually a result of build, it should be skipped.
	 */
	const doNotMatchPackageJson: Expression = ['not', ['match', 'package.json', 'basename']];

	/**
	 * Only trigger changes within local packages in a workspace
	 */
	const matchInLocalPackageDirectories: Expression = [
		'anyof',
		...workspacePackages
			.map((workspacePackage) => workspacePackage.packageJson.name)
			.filter(isNotNullish)
			.map<Expression>((packageName) => ['dirname', packageName]),
	];

	const commonIgnoredDirs: Expression[] = [
		['dirname', 'dist'],
		['dirname', '.turbo'],
		['dirname', '.vercel'],
		['dirname', '.cache'],
		['dirname', 'coverage'],
		['dirname', 'build'],
		['match', 'vite(st)?.config.*'],
	];

	if (!options.deep) {
		commonIgnoredDirs.push(['dirname', 'node_modules']); // This prevents deep dependencies from being watched
	}

	const doNotMatchCommonOutputs: Expression = ['not', ['anyof', ...commonIgnoredDirs]];

	const watchExpression: Expression = [
		'allof',
		matchInLocalPackageDirectories,
		doNotMatchCommonOutputs,
		doNotMatchPackageJson,
	];

	if (options.useGitIgnore) {
		let ignoreEntries = await collectIgnoreEntries(options);

		if (options.deep) {
			ignoreEntries = ignoreEntries.filter(
				(entry) => !entry.includes(NODE_MODULES_DIRECTORY_NAME),
			);
		}

		const ignoreMatchEntries = ignoreEntries.map<Expression>((ignoreEntry) => [
			'match',
			ignoreEntry,
		]);

		const doNotMatchIgnored: Expression = ['not', ['anyof', ...ignoreMatchEntries]];
		watchExpression.push(doNotMatchIgnored);
	}

	let changeCount = 0;

	const startCommand = (): ChildProcess => {
		return spawn(options.packageManagerCommand, ['run', options.devScript], {
			stdio: 'inherit',
		});
	};

	let spawnedOnFirstBuild: ChildProcess | undefined;

	return {
		project: currentPackagesNodeModulesPath,
		debounce: { wait: 50 },
		triggers: [
			{
				expression: watchExpression,
				name: 'build',
				retry: { retries: 0 },
				onChange: async ({ spawn, files }) => {
					if (options.logChangedFiles) {
						console.log('changed files:', files);
					}

					await spawn`${options.packageManagerCommand} run ${options.buildDependenciesScript}`;
					if (changeCount < 1) {
						spawnedOnFirstBuild = options.onFirstBuild
							? options.onFirstBuild()
							: startCommand();
					}
					changeCount++;
				},
				onTeardown: async (): Promise<void> => {
					if (spawnedOnFirstBuild) {
						spawnedOnFirstBuild.kill();
					}
					await noopAsync();
				},
			},
		],
	};
};
