import { YargsBuilder, yargsForDistributeInWorkspaceOptions } from '@alexaegis/cli-tools';
import type { PackageJson } from '@alexaegis/workspace-tools';

import packageJson from '../../package.json';
import { setupVite } from '../functions/index.js';

const yarguments = YargsBuilder.withDefaults(packageJson as PackageJson)
	.add(yargsForDistributeInWorkspaceOptions)
	.build();

void (async () => await setupVite(await yarguments.parseAsync()))();
