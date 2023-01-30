import {
	DistributeInWorkspaceOptions,
	yargsForDistributeInWorkspaceOptions,
} from '@alexaegis/workspace-tools';
import yargs, { Argv } from 'yargs';
import { distributePrettierConfig } from '../functions/index.js';

import packageJson from '../../package.json';

const yarguments: Argv<DistributeInWorkspaceOptions> = yargsForDistributeInWorkspaceOptions(
	yargs(process.argv.splice(2))
		.version(packageJson.version)
		.epilogue(`${packageJson.name}@${packageJson.version} home: ${packageJson.homepage}`)
		.help()
		.completion()
);

(async () => await distributePrettierConfig(await yarguments.parseAsync()))();
