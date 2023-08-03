import type { Defined } from '@alexaegis/common';
import { normalizeCwdOption, type CwdOption } from '@alexaegis/fs';
import type { ChildProcess } from 'node:child_process';

export interface TurbowatchLocalNodeModulesOptions extends CwdOption {
	/**
	 * If true, it will make sure ignore statements do not contain node_modules
	 * so the watcher can watch the entire dependency tree.
	 *
	 * If false deeper node_modules will be ignored.
	 *
	 * @default true
	 */
	deep?: boolean | undefined;

	/**
	 * If the default ignored files like
	 * - 'dist'
	 * - '.turbo'
	 * - '.vercel'
	 * - '.cache'
	 * - 'coverage'
	 * - 'build'
	 *
	 * Does not suffice, you can enable this and then it will read all the
	 * .gitignore files up your project root and include those too in the do
	 * not watch list. This could potentially ignore more than you actually
	 * want though!
	 *
	 * @default false
	 */
	useGitIgnore?: boolean | undefined;

	/**
	 * Log out changed files on every change. Useful for debugging if you
	 * notice builds are getting triggered over and over again.
	 *
	 * @default false
	 */
	logChangedFiles?: boolean | undefined;

	/**
	 * The command used to build the dependencies of this package.
	 *
	 * @default 'build:dependencies'
	 */
	buildDependenciesScript?: string | undefined;

	/**
	 * Which package manager to invoke when running buildDependenciesScript
	 *
	 * @default 'pnpm'
	 */
	packageManagerCommand?: string | undefined;

	/**
	 * Called the first time buildDependenciesScript finished
	 * You can use this to start your app if the way devScript doesn't suffice.
	 * If this is defined, devScript will not be used!
	 *
	 * It can be async but it won't be awaited!
	 */
	onFirstBuild?: (() => ChildProcess | undefined) | undefined;

	/**
	 * What package.json script should be started once buildDependenciesScript
	 * is first finished. By default it's `dev_` with an underscore at the
	 * end as this turbowatch call should be named `dev`
	 *
	 * @default 'dev_'
	 */
	devScript?: string | undefined;
}

// type gr= Defined<Omit<TurbowatchLocalNodeModulesOptions, 'onFirstBuild'>>
// type asd = Pick<TurbowatchLocalNodeModulesOptions, 'onFirstBuild'>
// type hhrt = gr | asd
// const a :hhrt ={}

export type NormalizedTurbowatchLocalNodeModulesOptions = Defined<
	Omit<TurbowatchLocalNodeModulesOptions, 'onFirstBuild'>
> &
	Pick<TurbowatchLocalNodeModulesOptions, 'onFirstBuild'>;

export const normalizeTurbowatchLocalNodeModulesOptions = (
	options?: TurbowatchLocalNodeModulesOptions,
): NormalizedTurbowatchLocalNodeModulesOptions => {
	return {
		...normalizeCwdOption(options),
		deep: options?.deep ?? true,
		useGitIgnore: options?.useGitIgnore ?? false,
		logChangedFiles: options?.logChangedFiles ?? false,
		buildDependenciesScript: options?.buildDependenciesScript ?? 'build:dependencies',
		packageManagerCommand: options?.packageManagerCommand ?? 'pnpm',
		onFirstBuild: options?.onFirstBuild,
		devScript: options?.devScript ?? 'dev_',
	};
};
