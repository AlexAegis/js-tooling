import { normalizeCwdOption, type CwdOption } from '@alexaegis/fs';
import {
	collectWorkspacePackages,
	type RegularWorkspacePackage,
	type RootWorkspacePackage,
	type WorkspacePackage,
} from '@alexaegis/workspace-tools';
import p from 'node:path';

export interface CurrentWorkspacePackageWithRoot {
	workspacePackage: RegularWorkspacePackage;
	rootWorkspacePackage: RootWorkspacePackage;
	allWorkspacePackages: WorkspacePackage[];
}

export const findCurrentAndRootWorkspacePackage = async (
	rawOptions?: CwdOption,
): Promise<CurrentWorkspacePackageWithRoot> => {
	const options = normalizeCwdOption(rawOptions);
	const packageDirName = options.cwd.slice(Math.max(0, options.cwd.lastIndexOf(p.sep)));
	const workspace = await collectWorkspacePackages(options);

	const rootWorkspacePackage = workspace.find(
		(workspacePackage): workspacePackage is RootWorkspacePackage =>
			workspacePackage.packageKind === 'root',
	);

	const workspacePackage = workspace.find(
		(workspacePackage): workspacePackage is RegularWorkspacePackage =>
			workspacePackage.packageKind === 'regular' &&
			workspacePackage.packagePath.includes(options.cwd) &&
			(workspacePackage.packagePath + p.sep).includes(packageDirName + p.sep),
	);

	if (!rootWorkspacePackage || !workspacePackage) {
		throw new Error('Package could not be determined');
	}

	return { workspacePackage, rootWorkspacePackage, allWorkspacePackages: workspace };
};
