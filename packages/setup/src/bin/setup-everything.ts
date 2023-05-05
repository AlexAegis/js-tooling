import { YargsBuilder } from '@alexaegis/cli-tools';
import type { PackageJson } from '@alexaegis/workspace-tools';
import packageJson from '../../package.json';
import { yargsForSetup } from '../ochestrator/setup.function.yargs.js';

const yarguments = YargsBuilder.withDefaults(packageJson as PackageJson)
	.add(yargsForSetup)
	.build();

void (async () => {
	const options = await yarguments.parseAsync();
	console.log(options);
})();
