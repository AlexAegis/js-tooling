import { asyncFilterMap, asyncMap, dry } from '@alexaegis/common';
import type { NormalizedLoggerOption } from '@alexaegis/logging';
import {
	isDirectlyTargetedElement,
	isGlobTargetedElement,
	isMultiTargetedElement,
	isTargetedElement,
	isUntargetedElementWithSourceInformation,
	type GroupedSetupElementsWithMetadata,
	type SetupElement,
	type SetupElementTypes,
	type SetupElementUniqueKind,
	type SetupElementWithMetadata,
	type SetupElementWithSourcePlugin,
	type SetupPlugin,
	type SetupPluginOptions,
	type SourcePluginInformation,
} from '@alexaegis/setup-plugin';
import { tsSetupPlugin } from '@alexaegis/setup-ts';
import { collectWorkspacePackages, type WorkspacePackage } from '@alexaegis/workspace-tools';
import { globby } from 'globby';
import { minimatch } from 'minimatch';
import { cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { elementAndPluginFilter } from './element-and-plugin-filter.function.js';
import {
	normalizeSetupOptions,
	type NormalizedSetupOptions,
	type SetupOptions,
} from './setup.function.options.js';

export type AlreadyFilteredSetupElement = Omit<SetupElement, 'packageJsonFilter' | 'packageKind'>;

export type WorkspacePackageWithElements = WorkspacePackage & {
	elements: SetupElementWithSourcePlugin[];
};

export interface TargetNormalizedElement {
	element: SetupElementWithMetadata;
	targetFiles: string[];
}

export type WorkspacePackageWithTargetedElements = WorkspacePackage & {
	targetedElements: TargetNormalizedElement[];
	untargetedElements: (SetupElementUniqueKind & SourcePluginInformation)[];
};

export type WorkspacePackageElementsByTarget = WorkspacePackage & {
	targetedElements: Record<string, SetupElementWithMetadata[]>;
	untargetedElements: (SetupElementUniqueKind & SourcePluginInformation)[];
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
		targetedElements: n.targetedElements.reduce<Record<string, SetupElementWithMetadata[]>>(
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
	sourceElements: SetupElementWithMetadata[];
}

export const groupElementsByType = (
	elements: SetupElementWithMetadata[]
): GroupedSetupElementsWithMetadata => {
	return elements.reduce<Record<SetupElementTypes, SetupElementWithMetadata[]>>(
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
	) as GroupedSetupElementsWithMetadata;
};

/**
 * Checks for conflicts in the collected setup elements for all targets
 */
export const verifyPackageSetupElements = (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget
): PackageSetupElementError[] => {
	const errors = Object.entries(workspacePackageElementsByTarget.targetedElements).flatMap(
		([target, elementsOnATarget]) => {
			const elementsByType = elementsOnATarget.reduce<
				Record<SetupElementTypes, SetupElementWithMetadata[]>
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

/**
 *
 */
export type ItemOf<T extends readonly unknown[]> = T extends readonly (infer R)[] ? R : never;

export const applyFileRemoveElement = async (
	removeElement: ItemOf<GroupedSetupElementsWithMetadata['file-remove']>,
	relativeFilePath: string,
	options: NormalizedSetupOptions
): Promise<void> => {
	options.logger.info(`Executing ${removeElement.name}`);
	const filePath = join(options.cwd, relativeFilePath);
	const dryRm = dry(options.dry, rm);
	await dryRm(filePath);
	options.logger.info(`Removing ${filePath}`);
};

export const applyFileCopyElement = async (
	copyElement: ItemOf<GroupedSetupElementsWithMetadata['file-copy']>,
	relativeFilePath: string,
	options: NormalizedSetupOptions
): Promise<void> => {
	options.logger.info(`Executing ${copyElement.name}`);
	const filePath = join(options.cwd, relativeFilePath);
	const dryCp = dry(options.dry, cp);
	await dryCp(copyElement.sourceFile, filePath);
	options.logger.info(`Copy ${filePath}`);
};

export const applyWorkspacePackageElementsByTarget = async (
	workspacePackageElementsByTarget: WorkspacePackageElementsByTarget,
	options: NormalizedSetupOptions
): Promise<void> => {
	options.logger.info(
		`processing elements targeting ${workspacePackageElementsByTarget.packagePath}`
	);
	// Todo: concurrency using Promise.allSettled

	for (const [relativeFilePath, elements] of Object.entries(
		workspacePackageElementsByTarget.targetedElements
	)) {
		const grouped = groupElementsByType(elements);

		for (const fileRemoveElement of grouped['file-remove']) {
			await applyFileRemoveElement(fileRemoveElement, relativeFilePath, options);
		}
	}
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

	const workspacePackagesWithElementsByTarget = await asyncMap(
		workspacePackageElements,
		elementsByTargetFile
	);

	console.log(workspacePackagesWithElementsByTarget);

	const errors = workspacePackagesWithElementsByTarget.flatMap((workspacePackageElements) =>
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

	await Promise.allSettled([
		workspacePackagesWithElementsByTarget.map((workspacePackageElementsByTarget) =>
			applyWorkspacePackageElementsByTarget(workspacePackageElementsByTarget, options)
		),
	]);
};
