import type { Awaitable } from '@alexaegis/common';
import type {
	PackageJson,
	RegularWorkspacePackage,
	WorkspacePackage,
} from '@alexaegis/workspace-tools';
import type { InputOption } from 'rollup';
import type { PackageJsonKindType } from '../index.js';
import type { PackageExportPathContext } from './export/package-export-path-context.interface.js';

export interface PackageExaminationResult {
	packageJsonUpdates: Partial<PackageJson>;
	/**
	 * A list of package relative paths to all the exported/bin files.
	 * This guarantees that everything that the package exposes is built.
	 */
	bundlerEntryFiles: Exclude<InputOption, string | string[]>;
}

export interface PakkFeature {
	/**
	 * The higher the number the later the feature will be invoked within each
	 * step.
	 *
	 * The only real use of this is to make sure the sorting of the packageJson
	 * file happens last.
	 */
	order: number;
	/**
	 * Called once at the start of Autolib, giving a change for each plugin
	 * to examine the package.
	 *
	 * The returned examination result is merged
	 * together with the other plugins result, sharing them the next step.
	 * TODO: Re-evaluate if this is even useful or you should just
	 * keep your result in the plugin. This could return void
	 */
	examinePackage?: (
		workspacePackage: WorkspacePackage,
	) => Awaitable<Partial<PackageExaminationResult>>;

	/**

	 * Runs after `update`
	 */
	process?: (
		packageJson: PackageJson,
		pathContext: PackageExportPathContext,
	) => Awaitable<PackageJson | PackageJson[] | undefined>;

	/**
	 * A final, synchronous step to modify the packageJson file.
	 * The returned object will replace the original one completely, no
	 * merging is happening.
	 * `postprocess` steps are happening sequentially, in order the
	 * subplugins are defined.
	 */
	postprocess?: (
		workspacePackage: RegularWorkspacePackage,
		sourcePackageJsonTarget: PackageJsonKindType,
	) => PackageJson;
}
