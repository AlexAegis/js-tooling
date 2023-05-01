import { asyncFilterMap, asyncMap, isNotNullish } from '@alexaegis/common';
import type { NormalizedLoggerOption } from '@alexaegis/logging';
import { objectMatch, type JsonMatcher } from '@alexaegis/object-match';
import {
	isDirectlyTargetedElement,
	isGlobTargetedElement,
	isMultiTargetedElement,
	isTargetedElement,
	isUntargetedElementWithSourceInformation,
	type SetupElement,
	type SetupElementTypes,
	type SetupElementUniqueKind,
	type SetupElementWithSourcePlugin,
	type SetupElementWithoutTargetingWithSourcePlugin,
	type SetupPlugin,
	type SetupPluginFilter,
	type SetupPluginOptions,
	type SourcePluginInformation,
} from '@alexaegis/setup-plugin';
import { tsSetupPlugin } from '@alexaegis/setup-ts';
import { collectWorkspacePackages, type WorkspacePackage } from '@alexaegis/workspace-tools';
import { globby } from 'globby';
import { minimatch } from 'minimatch';
import { normalizeSetupOptions, type SetupOptions } from './setup.function.options.js';

export type AlreadyFilteredSetupElement = Omit<SetupElement, 'packageJsonFilter' | 'packageKind'>;

export type WorkspacePackageWithElements = WorkspacePackage & {
	elements: SetupElementWithSourcePlugin[];
};

export interface TargetNormalizedElement {
	element: SetupElementWithoutTargetingWithSourcePlugin;
	targetFiles: string[];
}

export type WorkspacePackageWithTargetedElements = WorkspacePackage & {
	targetedElements: TargetNormalizedElement[];
	untargetedElements: (SetupElementUniqueKind & SourcePluginInformation)[];
};

export type WorkspacePackageElementsByTarget = WorkspacePackage & {
	targetedElements: Record<string, SetupElementWithoutTargetingWithSourcePlugin[]>;
	untargetedElements: (SetupElementUniqueKind & SourcePluginInformation)[];
};

export const elementAndPluginFilter = (
	workspacePackage: WorkspacePackage,
	filter: SetupPluginFilter
): boolean => {
	const pluginPackageKind = filter.packageKind ?? 'all';

	let result = pluginPackageKind === 'all' || pluginPackageKind === workspacePackage.packageKind;

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
					.map<SetupElementWithSourcePlugin>((element) => ({
						...element,
						sourcePlugin: plugin,
					}))
			),
	};
};

export const normalizeSetupElements = async (
	workspacePackage: WorkspacePackageWithElements
): Promise<WorkspacePackageWithTargetedElements> => {
	const untargetedElements = workspacePackage.elements.filter(
		isUntargetedElementWithSourceInformation
	);
	const targetedElements = workspacePackage.elements.filter(isTargetedElement);

	const elements = await asyncFilterMap(targetedElements, async (element) => {
		const targetFiles: string[] = [];

		if (isDirectlyTargetedElement(element)) {
			targetFiles.push(element.targetFile);
		}

		if (isGlobTargetedElement(element)) {
			const matchedFiles = await globby(element.globPattern, {
				cwd: workspacePackage.packagePath,
			});

			targetFiles.push(...matchedFiles);
		}

		if (isMultiTargetedElement(element)) {
			targetFiles.push(...element.targetFiles);
		}

		return { element, targetFiles: [...new Set(targetFiles)] } as TargetNormalizedElement;
	});

	return {
		...workspacePackage,
		targetedElements: elements,
		untargetedElements,
	};
};

export const elementsByTargetFile = async (
	workspacePackage: WorkspacePackageWithElements
): Promise<WorkspacePackageElementsByTarget> => {
	const n = await normalizeSetupElements(workspacePackage);
	return {
		...n,
		targetedElements: n.targetedElements.reduce<
			Record<string, SetupElementWithoutTargetingWithSourcePlugin[]>
		>((groups, next) => {
			for (const targetFile of next.targetFiles) {
				groups[targetFile]?.push(next.element);

				if (!groups[targetFile]) {
					groups[targetFile] = [next.element];
				}
			}

			return groups;
		}, {}),
	};
};

export const SETUP_ERROR_MULTIPLE_COPIES = 'ESETUPMULTICOPY';
export const SETUP_ERROR_MULTIPLE_COPIES_AND_REMOVES = 'ESETUPMULTICOPYANDREMOVE';
export const SETUP_ERROR_WORKSPACE_ELEMENT_TARGETING_INSIDE_PACKAGE = 'ESETUPROOTINTOPACKAGE';

export type PackageSetupElementErrorTypes =
	| typeof SETUP_ERROR_MULTIPLE_COPIES
	| typeof SETUP_ERROR_MULTIPLE_COPIES_AND_REMOVES
	| typeof SETUP_ERROR_WORKSPACE_ELEMENT_TARGETING_INSIDE_PACKAGE;

export interface PackageSetupElementError {
	type: PackageSetupElementErrorTypes;
	target: string;
	message: string;
	workspacePackage: WorkspacePackage;
	sourcePlugins: SetupPlugin[];
	sourceElements: SetupElementWithoutTargetingWithSourcePlugin[];
}

/**
 * Checks for conflicts in the collected setup elements for all targets
 */
export const verifyPackageSetupElements = (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget
): PackageSetupElementError[] => {
	const errors = Object.entries(workspacePackageElementsByTarget.targetedElements).flatMap(
		([target, elementsOnATarget]) => {
			const elementsByType = elementsOnATarget.reduce<
				Record<SetupElementTypes, SetupElementWithoutTargetingWithSourcePlugin[]>
			>(
				(groups, next) => {
					groups[next.type].push(next);
					return groups;
				},
				{
					'file-copy': [],
					'file-remove': [],
					'file-symlink': [],
					'file-transform': [],
					json: [],
					unique: [],
				}
			);

			const errors: PackageSetupElementError[] = [];

			if (elementsByType['file-copy'].length > 1) {
				errors.push({
					target,
					type: SETUP_ERROR_MULTIPLE_COPIES,
					message: 'More than one element tries to copy to the same place!',
					workspacePackage: workspacePackageElementsByTarget,
					sourceElements: elementsByType['file-copy'],
					sourcePlugins: elementsByType['file-copy'].flatMap(
						(element) => element.sourcePlugin
					),
				});
			}

			if (elementsByType['file-copy'].length + elementsByType['file-remove'].length > 1) {
				const erroredElements = [
					...elementsByType['file-copy'],
					...elementsByType['file-remove'],
				];
				errors.push({
					target,
					type: SETUP_ERROR_MULTIPLE_COPIES_AND_REMOVES,
					message: 'More than one element',
					workspacePackage: workspacePackageElementsByTarget,
					sourceElements: erroredElements,
					sourcePlugins: erroredElements.flatMap((element) => element.sourcePlugin),
				});
			}

			return errors;
		}
	);

	if (workspacePackageElementsByTarget.packageKind === 'root') {
		const elementsTargetingInsideAPackage = Object.entries(
			workspacePackageElementsByTarget.targetedElements
		).flatMap(([target, elements]) =>
			workspacePackageElementsByTarget.workspacePackagePatterns
				.filter((pattern) => minimatch(target, pattern))
				.flatMap(() => elements)
				.map((element) => ({ element, target }))
		);

		if (elementsTargetingInsideAPackage.length > 0) {
			errors.push(
				...elementsTargetingInsideAPackage.map<PackageSetupElementError>(
					(elementTargetingInsideAPackage) => ({
						type: SETUP_ERROR_WORKSPACE_ELEMENT_TARGETING_INSIDE_PACKAGE,
						message: 'A workspace level element tries to modify a a sub-package!',
						workspacePackage: workspacePackageElementsByTarget,
						target: elementTargetingInsideAPackage.target,
						sourceElements: [elementTargetingInsideAPackage.element],
						sourcePlugins: [elementTargetingInsideAPackage.element.sourcePlugin],
					})
				)
			);
		}
	}

	return errors;
};

export const reportPackageSetupElementError = (
	error: PackageSetupElementError,
	options: NormalizedLoggerOption
): void => {
	const affectedPlugins = `Affected plugin${
		error.sourcePlugins.length > 1 ? 's' : ''
	}: ${error.sourcePlugins.map((p) => p.name).join(', ')}`;
	const affectedElements = `Affected element${
		error.sourceElements.length > 1 ? 's' : ''
	}: ${error.sourceElements.map((p) => p.name).join(', ')}`;

	options.logger.error(`Error: ${error.type}
	Reason: ${error.message}
	Target: ${error.target}
	${affectedPlugins}
	${affectedElements}
	Workspace: ${error.workspacePackage.packagePath}`);
};

export const setup = async (rawOptions: SetupOptions): Promise<void> => {
	const options = normalizeSetupOptions(rawOptions);
	const logger = options.logger.getSubLogger({ name: 'setup' });

	// collect target packages
	const workspacePackages = await collectWorkspacePackages(options);
	const workspaceRootPackage = workspacePackages.find(
		(workspacePackage) => workspacePackage.packageKind === 'root'
	);

	if (!workspaceRootPackage) {
		logger.warn('cannot do setup, not in a workspace!');
		return;
	}

	const pluginOptions: SetupPluginOptions = {
		...options,
		workspaceRoot: workspaceRootPackage.packagePath,
	};

	// Load plugins
	// TODO: instead of having a fixed set of plugins, detect them
	const plugins: SetupPlugin[] = [];
	const tsPlugin = tsSetupPlugin(pluginOptions);

	if (tsPlugin) {
		plugins.push(tsPlugin);
	}

	// Collect elements?

	const workspacePackageElements = workspacePackages.map((workspacePackage) =>
		filterElementsForPackage(workspacePackage, plugins)
	);

	const workspacePackageElementsByTarget = await asyncMap(
		workspacePackageElements,
		elementsByTargetFile
	);

	console.log(workspacePackageElementsByTarget);

	const errors = workspacePackageElementsByTarget.flatMap((workspacePackageElements) =>
		verifyPackageSetupElements(workspacePackageElements)
	);

	if (errors.length > 0) {
		logger.error('Error detected within setup elements!');
		for (const error of errors) {
			reportPackageSetupElementError(error, options);
		}
		return undefined;
	}

	logger.info('Valid setup elements, proceeding');

	// apply

	return undefined;
};
