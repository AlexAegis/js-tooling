import { createMockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
	AutotoolPluginObject,
	NormalizedAutotoolPluginOptions,
	PackageManager,
	WorkspacePackage,
} from 'autotool-plugin';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as library from './index.js';

describe('autotool-plugin-typedoc', () => {
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

	describe('workspace typedoc entry points', () => {
		let rootPath: string;

		const addPackage = (packagePath: string): void => {
			mkdirSync(join(rootPath, packagePath), { recursive: true });
			writeFileSync(join(rootPath, packagePath, 'package.json'), '{}');
		};

		beforeEach(() => {
			rootPath = mkdtempSync(join(tmpdir(), 'autotool-plugin-typedoc-'));
		});

		afterEach(() => {
			rmSync(rootPath, { recursive: true, force: true });
		});

		it('should only use the documented folders that contain packages', () => {
			addPackage('apps/app');
			addPackage('examples/example');
			addPackage('packages/package');
			mkdirSync(join(rootPath, 'libs', 'not-a-package'), { recursive: true });

			expect(library.getWorkspaceTypedocEntryPoints(rootPath)).toEqual(['packages/*']);
		});

		it('should list every documented folder that contains packages', () => {
			addPackage('libs/lib');
			addPackage('packages/package');

			expect(library.getWorkspaceTypedocEntryPoints(rootPath)).toEqual([
				'libs/*',
				'packages/*',
			]);
		});

		it('should fall back to the root package without packages to document', () => {
			addPackage('apps/app');

			expect(library.getWorkspaceTypedocEntryPoints(rootPath)).toEqual(['.']);
		});

		it('should skip the folders that typedoc does not expand', () => {
			addPackage('packages/.hidden');
			addPackage('packages/node_modules');
			addPackage('vendor/linked');
			symlinkSync(join(rootPath, 'vendor', 'linked'), join(rootPath, 'packages', 'linked'));
			writeFileSync(join(rootPath, 'libs'), '');

			expect(library.getWorkspaceTypedocEntryPoints(rootPath)).toEqual(['.']);
		});

		it('should transform the template through the root typedoc element', async () => {
			addPackage('libs/lib');
			const plugin = (await (library.default as AutotoolPluginFactory)({
				...defaultOptions,
				rootWorkspacePackage: { ...rootWorkspacePackage, packagePath: rootPath },
			})) as AutotoolPluginObject;
			const elements = plugin.elements as unknown as {
				packageKind?: string;
				targetFile?: string;
				transformers?: ((content: string) => string)[];
			}[];
			const transformers = elements.find(
				(element) =>
					element.packageKind === 'root' && element.targetFile === 'typedoc.json',
			)?.transformers;

			expect(transformers).toHaveLength(1);
			expect(JSON.parse(transformers?.[0]?.('{}') ?? '{}')).toEqual({
				entryPoints: ['libs/*'],
				readme: 'none',
			});
		});

		it('should set the entry points and keep the rest of the template', () => {
			addPackage('packages/package');
			const template = readFileSync(
				join(import.meta.dirname, '..', 'static', 'workspace-typedoc.json'),
				'utf8',
			);

			const transformed = library.transformWorkspaceTypedocConfig(template, rootPath);

			expect(JSON.parse(transformed)).toEqual({
				...(JSON.parse(template) as Record<string, unknown>),
				entryPoints: ['packages/*'],
				readme: 'none',
			});
			expect(transformed).toMatch(/^\{\n\t"\$schema"/);
			expect(transformed).toMatch(/\}\n$/);
		});
	});
});
