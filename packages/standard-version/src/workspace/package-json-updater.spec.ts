import type { RegularWorkspacePackage } from '@alexaegis/workspace-tools';
import { describe, expect, it } from 'vitest';
import { createPackageJsonUpdater } from './package-json-updater.js';

describe('createPackageJsonUpdater', () => {
	const localPackage: RegularWorkspacePackage = {
		packageKind: 'regular',
		packageJson: { name: '@a/b' },
		packageJsonPath: '/project/packages/b/package.json',
		packagePath: '/project/packages/b',
		packagePathFromRootPackage: 'packages/b',
	};

	const updater = createPackageJsonUpdater([localPackage]);

	const writeDependencies = (dependencies: Record<string, string>, version: string): unknown =>
		JSON.parse(
			updater.writeVersion(JSON.stringify({ version: '1.0.0', dependencies }), version),
		);

	it('should replace the version and keep the range of a local dependency', () => {
		expect(writeDependencies({ '@a/b': '^1.0.0', '@x/y': '^2.0.0' }, '9.9.9')).toEqual({
			version: '9.9.9',
			dependencies: { '@a/b': '^9.9.9', '@x/y': '^2.0.0' },
		});
	});

	it('should keep the specifier of a workspace dependency', () => {
		expect(writeDependencies({ '@a/b': 'workspace:^1.0.0' }, '9.9.9')).toEqual({
			version: '9.9.9',
			dependencies: { '@a/b': 'workspace:^' },
		});
		expect(writeDependencies({ '@a/b': 'workspace:*' }, '9.9.9')).toEqual({
			version: '9.9.9',
			dependencies: { '@a/b': 'workspace:*' },
		});
	});

	it('should insert a version without expanding replacement patterns', () => {
		expect(writeDependencies({ '@a/b': '^1.0.0' }, '1.0.0-$&')).toEqual({
			version: '1.0.0-$&',
			dependencies: { '@a/b': '^1.0.0-$&' },
		});
	});

	it('should read the version up to its closing quote', () => {
		expect(updater.readVersion('{ "version": "1.2.3", "name": "x" }')).toBe('1.2.3');
	});
});
