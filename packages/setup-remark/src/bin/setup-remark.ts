import { YargsBuilder, yargsForDistributeInWorkspaceOptions } from '@alexaegis/cli-tools';
import type { DistributeInWorkspaceOptions, PackageJson } from '@alexaegis/workspace-tools';
import type { Argv } from 'yargs';
import packageJson from '../../package.json';
import { distributeRemarkConfig } from '../functions/index.js';

const yarguments: Argv<DistributeInWorkspaceOptions> = YargsBuilder.withDefaults(
	packageJson as PackageJson
)
	.add(yargsForDistributeInWorkspaceOptions)
	.build();

void (async () => await distributeRemarkConfig(await yarguments.parseAsync()))();
