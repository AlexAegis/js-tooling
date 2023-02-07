import { YargsBuilder, yargsForDistributeInWorkspaceOptions } from '@alexaegis/cli-tools';
import type { DistributeInWorkspaceOptions, PackageJson } from '@alexaegis/workspace-tools';
import type { Argv } from 'yargs';
import packageJson from '../../package.json';
import { distributePrettierConfig } from '../functions/index.js';

const yarguments: Argv<DistributeInWorkspaceOptions> = YargsBuilder.withDefaults(
	packageJson as PackageJson
)
	.add(yargsForDistributeInWorkspaceOptions)
	.build();

(async () => await distributePrettierConfig(await yarguments.parseAsync()))();
