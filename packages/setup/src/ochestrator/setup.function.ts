import { asyncFilterMap, asyncMap, isNotNullish } from '@alexaegis/common';
import { objectMatch, type JsonMatcher } from '@alexaegis/object-match';
import {
	isDirectlyTargetedElement,
	isGlobTargetedElement,
	isMultiTargetedElement,
	isTargetedElement,
	isUntargetedElement,
	type PackageJsonWithArchetype,
	type SetupElement,
	type SetupElementUniqueKind,
	type SetupElementWithoutTargeting,
	type SetupPlugin,
	type SetupPluginFilter,
	type SetupPluginOptions,
} from '@alexaegis/setup-plugin';
import { tsSetupPlugin } from '@alexaegis/setup-ts';
import { collectWorkspacePackages, getWorkspaceRoot } from '@alexaegis/workspace-tools';
import { globby } from 'globby';
import { normalizeSetupOptions, type SetupOptions } from './setup.function.options.js';

export interface WorkspacePackage {
	packageJson: PackageJsonWithArchetype;
	path: string;
	packageKind: 'workspace' | 'regular';
}

export type AlreadyFilteredSetupElement = Omit<SetupElement, 'packageJsonFilter' | 'packageKind'>;

export type WorkspacePackageWithElements = WorkspacePackage & {
	elements: SetupElement[];
};

export interface TargetNormalizedElement {
	element: SetupElementWithoutTargeting;
	targetFiles: string[];
}

export type WorkspacePackageWithTargetedElements = WorkspacePackage & {
	targetedElements: TargetNormalizedElement[];
	untargetedElements: SetupElementUniqueKind[];
};

export type WorkspacePackageElementsByTarget = WorkspacePackage & {
	targetedElements: Record<string, SetupElementWithoutTargeting[]>;
	untargetedElements: SetupElementUniqueKind[];
};

export const elementAndPluginFilter = (
	workspacePackage: WorkspacePackage,
	filter: SetupPluginFilter
): boolean => {
	const pluginPackageKind = filter.packageKind ?? 'both';

	let result = pluginPackageKind === 'both' || pluginPackageKind === workspacePackage.packageKind;

	if (isNotNullish(filter.packageJsonFilter)) {
		result =
			result &&
			objectMatch(workspacePackage.packageJson, filter.packageJsonFilter as JsonMatcher);
	}

	return result;
};

/**
 * Filters down each element for a package
 */
export const filterElementsForPackage = (
	workspacePackage: WorkspacePackage,
	setupPlugins: SetupPlugin[]
): WorkspacePackageWithElements => {
	return {
		...workspacePackage,
		elements: setupPlugins
			.filter((plugin) => elementAndPluginFilter(workspacePackage, plugin))
			.flatMap((plugin) =>
				plugin.elements
					.filter((element) => elementAndPluginFilter(workspacePackage, element))
					.map((element) => ({ ...element, sourcePlugin: plugin }))
			),
	};
};

export const normalizeSetupElements = async (
	workspacePackage: WorkspacePackageWithElements
): Promise<WorkspacePackageWithTargetedElements> => {
	const untargetedElements = workspacePackage.elements.filter(isUntargetedElement);
	const targetedElements = workspacePackage.elements.filter(isTargetedElement);

	const elements = await asyncFilterMap(targetedElements, async (element) => {
		const targetFiles: string[] = [];

		if (isDirectlyTargetedElement(element)) {
			targetFiles.push(element.targetFile);
		}

		if (isGlobTargetedElement(element)) {
			const matchedFiles = await globby(element.globPattern, {
				cwd: workspacePackage.path,
			});

			targetFiles.push(...matchedFiles);
		}

		if (isMultiTargetedElement(element)) {
			targetFiles.push(...element.targetFiles);
		}

		return { element, targetFiles: [...new Set(targetFiles)] } as TargetNormalizedElement;
	});

	return { ...workspacePackage, targetedElements: elements, untargetedElements };
};

export const elementsByTargetFile = async (
	workspacePackage: WorkspacePackageWithElements
): Promise<WorkspacePackageElementsByTarget> => {
	const n = await normalizeSetupElements(workspacePackage);
	return {
		...n,
		targetedElements: n.targetedElements.reduce<Record<string, SetupElementWithoutTargeting[]>>(
			(groups, next) => {
				for (const targetFile of next.targetFiles) {
					groups[targetFile]?.push(next.element);

					if (!groups[targetFile]) {
						groups[targetFile] = [next.element];
					}
				}

				return groups;
			},
			{}
		),
	};
};

export const setup = async (rawOptions: SetupOptions): Promise<void> => {
	const options = normalizeSetupOptions(rawOptions);
	const logger = options.logger.getSubLogger({ name: 'setup' });

	// TODO: instead of having a fixed set of plugins, detect them

	const workspaceRoot = getWorkspaceRoot(options.cwd);

	if (!workspaceRoot) {
		logger.warn('cannot do setup, not in a workspace!');
		return;
	}

	const pluginOptions: SetupPluginOptions = { ...options, workspaceRoot };

	// Load plugins
	const plugins: SetupPlugin[] = [];
	const tsPlugin = tsSetupPlugin(pluginOptions);

	if (tsPlugin) {
		plugins.push(tsPlugin);
	}

	// collect target packages
	const workspacePackages = await collectWorkspacePackages(options);

	// Collect elements?

	const workspacePackageElements = workspacePackages.map((workspacePackage) =>
		filterElementsForPackage(
			{
				...workspacePackage,
				packageKind: workspacePackage.path === workspaceRoot ? 'workspace' : 'regular',
			},
			plugins
		)
	);

	const workspacePackageElementsByTarget = await asyncMap(
		workspacePackageElements,
		elementsByTargetFile
	);

	console.log(workspacePackageElementsByTarget);

	// apply

	return undefined;
};
