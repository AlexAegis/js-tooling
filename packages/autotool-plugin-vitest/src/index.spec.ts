import { createMockLogger } from '@alexaegis/logging/mocks';
import vitePackageJson from '@alexaegis/vite/package.json' with { type: 'json' };
import type {
	AutotoolPluginFactory,
	AutotoolPluginObject,
	NormalizedAutotoolPluginOptions,
	PackageManager,
	WorkspacePackage,
} from 'autotool-plugin';
import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import * as library from './index.js';

const rootTestScriptOf = async (
	options: NormalizedAutotoolPluginOptions,
): Promise<string | undefined> => {
	const pluginObject = (await (library.plugin as AutotoolPluginFactory)(
		options,
	)) as AutotoolPluginObject;
	const elements = pluginObject.elements as unknown as {
		packageKind?: string;
		data?: { scripts?: Record<string, string> };
	}[];
	return elements.find(
		(element) =>
			element.packageKind === 'root' && element.data?.scripts?.['test'] !== undefined,
	)?.data?.scripts?.['test'];
};

describe('autotool-plugin-vitest', () => {
	const rootWorkspacePackage: WorkspacePackage = {
		workspacePackagePatterns: [],
		packageJson: {},
		packageJsonPath: '/project/package.json',
		packageKind: 'root',
		packagePath: '/project',
		packagePathFromRootPackage: '.',
	};

	const { logger } = createMockLogger(vi);

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

	it('should add the vite of @alexaegis/vite to the workspace root', async () => {
		const pluginObject = (await (library.plugin as AutotoolPluginFactory)(
			defaultOptions,
		)) as AutotoolPluginObject;
		const elements = pluginObject.elements as unknown as {
			packageKind?: string;
			data?: { devDependencies?: Record<string, string> };
		}[];
		const rootVite = elements
			.filter((element) => element.packageKind === 'root')
			.map((element) => element.data?.devDependencies?.['vite'])
			.filter((range) => range !== undefined);

		expect(rootVite).toEqual([vitePackageJson.dependencies.vite]);
	});

	describe('root test script', () => {
		const record = 'SF:a.ts\nend_of_record\n';

		it.each([
			{ name: 'an empty report', report: '', viewerStatus: 7, viewed: false, status: 0 },
			{
				name: 'a report of one blank line',
				report: '\n',
				viewerStatus: 7,
				viewed: false,
				status: 0,
			},
			{
				name: 'a report with a record',
				report: record,
				viewerStatus: 0,
				viewed: true,
				status: 0,
			},
			{
				name: 'a report that lcov-viewer fails on',
				report: record,
				viewerStatus: 7,
				viewed: true,
				status: 7,
			},
		])(
			'should run lcov-viewer only on a merged report with content and keep its exit status, given $name',
			async ({ report, viewerStatus, viewed, status }) => {
				const script = await rootTestScriptOf(defaultOptions);
				const reportStep = script?.split('merge-workspace-lcov-reports && ', 2)[1];
				expect(reportStep).toBeDefined();

				const folder = mkdtempSync(join(tmpdir(), 'autotool-plugin-vitest-'));
				try {
					mkdirSync(join(folder, 'bin'));
					mkdirSync(join(folder, 'coverage'));
					writeFileSync(
						join(folder, 'bin', 'lcov-viewer'),
						`#!/bin/sh\ntouch viewed\nexit ${viewerStatus.toString()}\n`,
					);
					chmodSync(join(folder, 'bin', 'lcov-viewer'), 0o755);
					writeFileSync(join(folder, 'coverage', 'lcov.info'), report);

					const result = spawnSync('sh', ['-c', reportStep ?? 'false'], {
						cwd: folder,
						env: {
							...process.env,
							PATH: `${join(folder, 'bin')}:${process.env['PATH'] ?? ''}`,
						},
					});

					expect(result.status).toBe(status);
					expect(existsSync(join(folder, 'viewed'))).toBe(viewed);
				} finally {
					rmSync(folder, { recursive: true, force: true });
				}
			},
		);
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
		])(
			'should select the matching config for $archetype',
			async ({ archetype, svelte, svelteKit }) => {
				const isSvelte = await archetypeFilterOf('package-svelte-vitest.config.ts');
				const isSvelteKit = await archetypeFilterOf('package-sveltekit-vitest.config.ts');

				expect(isSvelte(archetype)).toBe(svelte);
				expect(isSvelteKit(archetype)).toBe(svelteKit);
			},
		);
	});
});
