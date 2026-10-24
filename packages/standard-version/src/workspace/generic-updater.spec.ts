import type { RegularWorkspacePackage } from '@alexaegis/workspace-tools';
import { describe, expect, it } from 'vitest';
import { createGenericUpdater } from './generic-updater.js';

describe('createGenericUpdater', () => {
	const localPackage: RegularWorkspacePackage = {
		packageKind: 'regular',
		packageJson: { name: '@a/b' },
		packageJsonPath: '/project/packages/b/package.json',
		packagePath: '/project/packages/b',
		packagePathFromRootPackage: 'packages/b',
	};

	const updater = createGenericUpdater([localPackage]);

	it('should replace only the version after a package name', () => {
		expect(updater.writeVersion('see @a/b@1.0.0 and more\nnpm i @a/b@1.0.0', '9.9.9')).toBe(
			'see @a/b@9.9.9 and more\nnpm i @a/b@9.9.9',
		);
	});

	it('should keep what follows the version', () => {
		expect(
			updater.writeVersion(
				'"@a/b@1.0.0", `@a/b@1.0.0`, unpkg.com/@a/b@1.0.0/dist/x.js, @a/b@1.0.0-beta.1.',
				'9.9.9',
			),
		).toBe('"@a/b@9.9.9", `@a/b@9.9.9`, unpkg.com/@a/b@9.9.9/dist/x.js, @a/b@9.9.9.');
	});

	it('should keep the range of a version after a package name', () => {
		expect(updater.writeVersion('pnpm add @a/b@^1.0.0 @a/b@~1.0.0', '9.9.9')).toBe(
			'pnpm add @a/b@^9.9.9 @a/b@~9.9.9',
		);
	});

	it('should keep a workspace star dependency', () => {
		expect(updater.writeVersion('"@a/b": "workspace:*"', '9.9.9')).toBe(
			'"@a/b": "workspace:*"',
		);
	});

	it('should match the package name literally', () => {
		const dottedUpdater = createGenericUpdater([
			{ ...localPackage, packageJson: { name: 'a.b' } },
		]);

		expect(dottedUpdater.writeVersion('"axb": "^1.0.0", axb@1.0.0', '9.9.9')).toBe(
			'"axb": "^1.0.0", axb@1.0.0',
		);
	});

	it('should replace only up to the closing quote', () => {
		expect(
			updater.writeVersion(
				'{ "version": "1.0.0", "@a/b": "^1.0.0", "@x/y": "^2.0.0" }',
				'9.9.9',
			),
		).toBe('{ "version": "9.9.9", "@a/b": "^9.9.9", "@x/y": "^2.0.0" }');
		expect(updater.readVersion('{ "version": "1.2.3", "name": "x" }')).toBe('1.2.3');
	});

	it('should not replace the version of a longer package name', () => {
		const unscopedUpdater = createGenericUpdater([
			{ ...localPackage, packageJson: { name: 'b' } },
		]);

		expect(
			unscopedUpdater.writeVersion(
				'@x/b@1.0.0 foob@1.0.0 foo_b@1.0.0 b@1.0.0 /b@1.0.0 _b@1.0.0_',
				'9.9.9',
			),
		).toBe('@x/b@1.0.0 foob@1.0.0 foo_b@1.0.0 b@9.9.9 /b@9.9.9 _b@9.9.9_');
	});

	it('should replace the version in markdown emphasis', () => {
		expect(updater.writeVersion('_@a/b@1.0.0_', '9.9.9')).toBe('_@a/b@9.9.9_');
	});

	it('should insert a version without expanding replacement patterns', () => {
		expect(updater.writeVersion('"@a/b": "^1.0.0"', '1.0.0-$&')).toBe('"@a/b": "^1.0.0-$&"');
	});

	it('should keep the specifier of a workspace dependency', () => {
		expect(updater.writeVersion('"@a/b": "workspace:^1.0.0"', '9.9.9')).toBe(
			'"@a/b": "workspace:^"',
		);
	});

	it('should read the version of the file', () => {
		expect(updater.readVersion('{ "version": "1.2.3" }')).toBe('1.2.3');
	});
});
