// Resolves the changelog preset that commit-and-tag-version depends on

import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const PRESET_NAME = 'conventional-changelog-conventionalcommits';

/**
 * commit-and-tag-version 13 imports this preset by name, which finds the copy
 * pnpm hoisted. If that copy is older than version 8, the changelog has no
 * sections and the `!` breaking change marker is ignored.
 */
export const resolveChangelogPreset = (
	workspaceRoot: string,
): Record<string, unknown> | undefined => {
	const releaseToolLink = join(workspaceRoot, 'node_modules', 'commit-and-tag-version');
	if (!existsSync(releaseToolLink)) {
		return undefined;
	}
	const releaseToolPath = realpathSync(releaseToolLink);

	// npm nests the preset when another version is hoisted.
	// pnpm always links it next to commit-and-tag-version.
	const presetPath = [
		join(releaseToolPath, 'node_modules', PRESET_NAME),
		join(dirname(releaseToolPath), PRESET_NAME),
	].find((path) => existsSync(path));
	if (!presetPath) {
		throw new Error(`${PRESET_NAME} is not installed for ${releaseToolPath}`);
	}

	// Preset 6, used by commit-and-tag-version 12, has no exports field
	const { exports, main } = JSON.parse(
		readFileSync(join(presetPath, 'package.json'), { encoding: 'utf8' }),
	) as { exports?: string | { import?: string }; main?: string };
	const entry = typeof exports === 'object' ? exports.import : (exports ?? main);
	if (!entry) {
		throw new Error(`No supported entry in ${join(presetPath, 'package.json')}`);
	}

	// commit-and-tag-version adds the config-spec defaults only to its default preset.
	// It sets preMajor, which keeps 0.x breaking changes minor, only on a preset object.
	const spec = createRequire(join(releaseToolPath, 'package.json'))(
		'conventional-changelog-config-spec',
	) as { properties: Record<string, { default?: unknown }> };
	return {
		...Object.fromEntries(
			Object.entries(spec.properties).map(([key, property]) => [key, property.default]),
		),
		name: join(presetPath, entry),
	};
};
