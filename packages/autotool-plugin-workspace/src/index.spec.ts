import { createMockLogger } from '@alexaegis/logging/mocks';
import type {
	AutotoolPluginFactory,
	AutotoolPluginObject,
	NormalizedAutotoolPluginOptions,
	PackageManager,
	WorkspacePackage,
} from 'autotool-plugin';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import * as library from './index.js';

describe('autotool-plugin-workspace', () => {
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

	it('should list the same workspace globs as the pnpm-workspace.yaml template', async () => {
		const plugin = (await (library.default as AutotoolPluginFactory)(
			defaultOptions,
		)) as AutotoolPluginObject;
		const elements = plugin.elements as unknown as { data?: { workspaces?: string[] } }[];
		const workspaces = elements.flatMap((element) => element.data?.workspaces ?? []);

		const template = readFileSync(
			join(import.meta.dirname, '..', 'static', 'pnpm-workspace.yaml'),
			'utf8',
		);
		const packages = /^packages:\n((?: {2}- .+\n)+)/m
			.exec(template)?.[1]
			?.split('\n')
			.filter((line) => line.length > 0)
			.map((line) => line.replace(/^ {2}- /, ''));

		expect(workspaces.length).toBeGreaterThan(0);
		expect(new Set(workspaces)).toEqual(new Set(packages));
	});

	it('should keep the @types/node override on the major of engines.node', async () => {
		const plugin = (await (library.default as AutotoolPluginFactory)(
			defaultOptions,
		)) as AutotoolPluginObject;
		const elements = plugin.elements as unknown as { data?: { engines?: { node?: string } } }[];
		const engineMajors = elements
			.map((element) => element.data?.engines?.node)
			.filter((range) => range !== undefined)
			.map((range) => /^>=(\d+)\./.exec(range)?.[1]);

		const template = readFileSync(
			join(import.meta.dirname, '..', 'static', 'pnpm-workspace.yaml'),
			'utf8',
		);
		const overrideMajor = /^ {2}'@types\/node': \^(\d+)\./m.exec(template)?.[1];

		expect(overrideMajor).toBeDefined();
		expect(engineMajors.length).toBeGreaterThan(0);
		expect(new Set(engineMajors)).toEqual(new Set([overrideMajor]));
	});
});
