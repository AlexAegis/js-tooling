import { nuke } from '../functions/index.js';

import {
	YargsBuilder,
	yargsForCollectWorkspacePackagesOptions,
	yargsForLogLevelOption,
} from '@alexaegis/cli-tools';
import { createLogger } from '@alexaegis/logging';
import type { PackageJson } from '@alexaegis/workspace-tools';
import packageJson from '../../package.json' with { type: 'json' };
import { DEFAULT_NUKE_GLOBS, DEFAULT_NUKE_LIST } from '../functions/nuke.function.options.js';

const yarguments = YargsBuilder.withDefaults(packageJson as PackageJson)
	.add(yargsForCollectWorkspacePackagesOptions)
	.add((y) =>
		y
			.option('skipNodeModules', {
				boolean: true,
				description: "Don't remove `node_modules` directories but try to clean them up",
				default: false,
			})
			.option('nukeList', {
				array: true,
				type: 'string',
				description: 'A list of folders and files to delete.',
				default: DEFAULT_NUKE_LIST,
			})
			.option('nukeMore', {
				array: true,
				type: 'string',
				description:
					'These will be nuked too. Same role as `nukeList` but defining this ' +
					"won't get rid of the built in nukelist",
			})
			.option('nukeGlobs', {
				array: true,
				type: 'string',
				description:
					'A list of globs to also delete, not as efficient as a flat path but ' +
					'sometimes necessary',
				default: DEFAULT_NUKE_GLOBS,
			})
			.option('nukeMoreGlobs', {
				array: true,
				type: 'string',
				description:
					"Additional globs to nuke if you don't want to overwrite the default ones",
			})
			.option('dontNukeIn', {
				array: true,
				type: 'string',
				description: "If it shouldn't nuke a specific package, add them here.",
			}),
	)
	.add(yargsForLogLevelOption);

void (async () => {
	const options = await yarguments.build().parseAsync();
	const logger = createLogger({ name: 'nuke ☢', minLevel: options.logLevel });
	await nuke({ ...options, logger });
})();
