import { createMockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
	AutotoolPluginObject,
	NormalizedAutotoolPluginOptions,
	PackageManager,
	WorkspacePackage,
} from 'autotool-plugin';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import * as library from './index.js';

describe('autotool-plugin-vitest', () => {
	const rootWorkspacePackage: WorkspacePackage = {
		workspacePackagePatterns: [],
		packageJson: {},
		packageJsonPath: '/project/package.json',
		packageKind: 'root',
		packagePath: '/project',
		packagePathFromRootPackage: '.',
	};

	const { logger } = createMockLogger<NormalizedAutotoolPluginOptions['logger']>(vi);

	const packageManager: PackageManager = {
		installCommand: 'pnpm i',
		name: 'pnpm',
	};

	const defaultOptions: NormalizedAutotoolPluginOptions = {
		cwd: '/projects/foo',
		dry: true,
		force: false,
		logger,
		rootWorkspacePackage,
		allWorkspacePackages: [rootWorkspacePackage],
		packageManager,
	};

	it('should be defined', () => {
		expect(library).toBeDefined();
	});

	it('should define a plugin by default', async () => {
		expect(library.default).toBeDefined();

		const plugin = await (library.default as AutotoolPluginFactory)(defaultOptions);

		expect(plugin).toBeDefined();
	});

	describe('svelte vitest configs', () => {
		interface ArchetypeFilteredElement {
			sourceFile?: string;
			packageJsonFilter?: { archetype?: (archetype: object) => boolean };
		}

		const archetypeFilterOf = async (sourceFile: string) => {
			const pluginObject = (await (library.plugin as AutotoolPluginFactory)(
				defaultOptions,
			)) as AutotoolPluginObject;
			const elements = pluginObject.elements as unknown as ArchetypeFilteredElement[];
			const element = elements.find(
				(element) => element.sourceFile === join('static', sourceFile),
			);
			return element?.packageJsonFilter?.archetype ?? (() => false);
		};

		it.each([
			{ archetype: { kind: 'app', framework: 'sveltekit' }, svelte: false, svelteKit: true },
			{ archetype: { kind: 'lib', framework: 'sveltekit' }, svelte: true, svelteKit: false },
			{ archetype: { kind: 'app', framework: 'svelte' }, svelte: true, svelteKit: false },
			{ archetype: { kind: 'lib', framework: 'svelte' }, svelte: true, svelteKit: false },
			{ archetype: { kind: 'lib', framework: 'svelte-lib' }, svelte: true, svelteKit: false },
			{ archetype: { kind: 'lib', platform: 'node' }, svelte: false, svelteKit: false },
		])('should match $archetype', async ({ archetype, svelte, svelteKit }) => {
			const isSvelte = await archetypeFilterOf('package-svelte-vitest.config.ts');
			const isSvelteKit = await archetypeFilterOf('package-sveltekit-vitest.config.ts');

			expect(isSvelte(archetype)).toBe(svelte);
			expect(isSvelteKit(archetype)).toBe(svelteKit);
		});
	});
});
