import { isNotNullish } from '@alexaegis/common';
import { match, type JsonMatcher } from '@alexaegis/match';
import type { SetupPluginFilter } from '@alexaegis/setup-plugin';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';

export const elementAndPluginFilter = (
	workspacePackage: WorkspacePackage,
	filter: SetupPluginFilter
): boolean => {
	const pluginPackageKind = filter.packageKind ?? 'all';

	let result = pluginPackageKind === 'all' || pluginPackageKind === workspacePackage.packageKind;

	if (isNotNullish(filter.packageJsonFilter)) {
		const packageJsonMatch = match(
			workspacePackage.packageJson,
			filter.packageJsonFilter as JsonMatcher
		);
		result = result && packageJsonMatch;
	}

	return result;
};
