import { YargsBuilder, yargsForDistributeInWorkspaceOptions } from '@alexaegis/cli-tools';
import type { PackageJson } from '@alexaegis/workspace-tools';
import type { Argv } from 'yargs';
import packageJson from '../../package.json';
import { setupStylelint } from '../functions/index.js';

const a: Argv<object> | undefined = undefined;
console.log(a);

const yarguments = YargsBuilder.withDefaults(packageJson as PackageJson)
	.add(yargsForDistributeInWorkspaceOptions)
	.build();

void (async () => await setupStylelint(await yarguments.parseAsync()))();
