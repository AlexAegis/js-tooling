import { YargsBuilder, yargsForDistributeInWorkspaceOptions } from '@alexaegis/cli-tools';
import type { PackageJson } from '@alexaegis/workspace-tools';

import packageJson from '../../package.json';
import { setupSvelte } from '../functions/index.js';

const yarguments = YargsBuilder.withDefaults(packageJson as PackageJson)
	.add(yargsForDistributeInWorkspaceOptions)
	.build();

void (async () => await setupSvelte(await yarguments.parseAsync()))();