import {
	defaultYargsFromPackageJson,
	yargsForCwdOption,
	yargsForDryOption,
	yargsForLogLevelOption,
} from '@alexaegis/cli-tools';
import { createLogger } from '@alexaegis/logging';
import type { PackageJson } from '@alexaegis/workspace-tools';
import yargs from 'yargs';
import packageJson from '../../package.json' with { type: 'json' };
import { pakkStandaloneRunner } from '../internal/pakk-standalone-runner.function.js';
import { yargsForAutoBin } from '../internal/yargs-for-auto-bin.function.js';
import { yargsForAutoExportStatic } from '../internal/yargs-for-auto-export-static.function.js';
import { yargsForAutoExport } from '../internal/yargs-for-auto-export.function.js';
import { yargsForAutoMetadata } from '../internal/yargs-for-auto-metadata.function.js';
import { yargsForPakk } from '../internal/yargs-for-pakk.function.js';

// ? The use of generics combined with the generics in yargs causes typescript
// ? to stall and bail with an inifnitely deep type error.
const a = defaultYargsFromPackageJson(packageJson as PackageJson)(
	yargs(process.argv.splice(2)),
) as any;
const b = yargsForLogLevelOption(a) as any;
const c = yargsForPakk(b) as any;
const d = yargsForAutoBin(c) as any;
const e = yargsForAutoExport(d) as any;
const f = yargsForAutoExportStatic(e) as any;
const g = yargsForAutoMetadata(f) as any;
const h = yargsForCwdOption(g) as any;
const yarguments = yargsForDryOption(h);

void (async () => {
	const options = await yarguments.parseAsync();
	const logger = createLogger({
		name: 'pakk',
		minLevel: options['logLevel'] as number,
	});

	logger.trace('Parsed options', options);
	await pakkStandaloneRunner({ ...options, logger });
})();
