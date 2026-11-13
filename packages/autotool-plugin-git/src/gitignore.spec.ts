import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const templatePath = fileURLToPath(new URL('../static/gitignore', import.meta.url));

describe('gitignore template', () => {
	let repositoryPath: string;

	const gitEnvironment = (): NodeJS.ProcessEnv => ({
		...Object.fromEntries(
			Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')),
		),
		GIT_CONFIG_GLOBAL: '/dev/null',
		GIT_CONFIG_NOSYSTEM: '1',
		HOME: repositoryPath,
		XDG_CONFIG_HOME: repositoryPath,
	});

	const ignoredPaths = (paths: string[]): string[] => {
		const result = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], {
			cwd: repositoryPath,
			encoding: 'utf8',
			env: gitEnvironment(),
			input: paths.join('\0') + '\0',
		});
		expect(result.status === 0 || result.status === 1, result.stderr).toBe(true);
		return result.stdout.split('\0').filter(Boolean);
	};

	beforeEach(() => {
		repositoryPath = mkdtempSync(join(tmpdir(), 'autotool-plugin-git-'));
		execFileSync('git', ['init', '--quiet', repositoryPath], { env: gitEnvironment() });
		copyFileSync(templatePath, join(repositoryPath, '.gitignore'));
	});

	afterEach(() => {
		rmSync(repositoryPath, { recursive: true, force: true });
	});

	it('should ignore build output and temporary folders', () => {
		const paths = [
			'dist',
			'packages/a/dist/index.js',
			'tmp/x',
			'packages/a/tmp/x',
			'.parcel-cache/x',
		];

		expect(ignoredPaths(paths)).toEqual(paths);
	});

	it('should not ignore source files whose name starts with dist or tmp', () => {
		expect(ignoredPaths(['distillation.md', 'src/distance.ts', 'tmpl.ts'])).toEqual([]);
	});
});
