import { addDistributeOptionsToYargs, DistributeOptions } from '@alexaegis/tools';
import yargs, { Argv } from 'yargs';
import { distributePrettierConfig } from '../functions/index.js';

import packageJson from '../../package.json';

const yarguments: Argv<DistributeOptions> = addDistributeOptionsToYargs(
	yargs(process.argv.splice(2))
		.version(packageJson.version)
		.epilogue(`${packageJson.name}@${packageJson.version} home: ${packageJson.homepage}`)
		.help()
		.completion()
);

(async () => distributePrettierConfig(await yarguments.parseAsync()))();
