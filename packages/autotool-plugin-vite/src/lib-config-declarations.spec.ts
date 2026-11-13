import { spawnSync } from 'node:child_process';
import {
	copyFileSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const packageDirectory = fileURLToPath(new URL('..', import.meta.url));

describe.each(['vite-lib.config.ts', 'vite-jslib.config.ts'])('the %s template', (template) => {
	let fixtureDirectory: string;

	const writeFixtureFile = (path: string, content: string): void => {
		const filePath = join(fixtureDirectory, path);
		mkdirSync(dirname(filePath), { recursive: true });
		writeFileSync(filePath, content);
	};

	beforeEach(() => {
		fixtureDirectory = mkdtempSync(join(tmpdir(), 'declarations-fixture-'));
		symlinkSync(join(packageDirectory, 'node_modules'), join(fixtureDirectory, 'node_modules'));
		copyFileSync(
			join(packageDirectory, 'static', template),
			join(fixtureDirectory, 'vite.config.ts'),
		);
		writeFixtureFile('vitest.config.ts', 'export default {};\n');
		writeFixtureFile(
			'package.json',
			JSON.stringify({
				name: 'declarations-fixture',
				type: 'module',
				exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } },
			}),
		);
		writeFixtureFile(
			'tsconfig.json',
			JSON.stringify({
				compilerOptions: {
					allowJs: true,
					declaration: true,
					jsx: 'preserve',
					module: 'esnext',
					moduleResolution: 'bundler',
					skipLibCheck: true,
					strict: true,
					target: 'es2022',
				},
				include: ['src/**/*', '*', '**/*.json'],
			}),
		);
		writeFixtureFile('src/index.ts', 'export const answer = 42;\n');
		for (const testFile of [
			'src/index.spec.ts',
			'src/a.test.js',
			'src/b.spec.mts',
			'src/c.spec.tsx',
			'src/d.test.cjs',
			'src/e.spec.cts',
			'src/__tests__/helper.ts',
			'src/__mocks__/mock.ts',
		]) {
			writeFixtureFile(testFile, 'export const value = 1;\n');
		}
	});

	afterEach(() => {
		rmSync(fixtureDirectory, { recursive: true, force: true });
	});

	it('should emit declarations only for the source files on a publish build', () => {
		const result = spawnSync(
			join(packageDirectory, 'node_modules', '.bin', 'vite'),
			['build'],
			{
				cwd: fixtureDirectory,
				encoding: 'utf8',
				env: { ...process.env, BUILD_REASON: 'publish' },
				timeout: 55_000,
			},
		);

		expect(result.status, result.stderr).toBe(0);
		const declarations = readdirSync(join(fixtureDirectory, 'dist'), { recursive: true })
			.map(String)
			.filter((path) => /\.d\.[cm]?ts$/.test(path));
		expect(declarations).toEqual(['index.d.ts']);
	}, 60_000);
});
