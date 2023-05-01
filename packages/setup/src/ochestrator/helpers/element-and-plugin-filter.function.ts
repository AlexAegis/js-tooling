import { isNotNullish } from '@alexaegis/common';
import { objectMatch, type JsonMatcher } from '@alexaegis/object-match';
import type { SetupPluginFilter } from '@alexaegis/setup-plugin';
import type { WorkspacePackage } from '@alexaegis/workspace-tools';

export const elementAndPluginFilter = (
	workspacePackage: WorkspacePackage,
	filter: SetupPluginFilter
): boolean => {
	const pluginPackageKind = filter.packageKind ?? 'all';

	let result = pluginPackageKind === 'all' || pluginPackageKind === workspacePackage.packageKind;

	if (isNotNullish(filter.packageJsonFilter)) {
		const packageJsonMatch = objectMatch(
			workspacePackage.packageJson,
			filter.packageJsonFilter as JsonMatcher
		);
		result = result && packageJsonMatch;
	}

	return result;
};
