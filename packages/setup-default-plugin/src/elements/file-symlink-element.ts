import { dry } from '@alexaegis/common';
import { symlink } from 'node:fs/promises';
import { join } from 'node:path';
import type { SetupElementExecutor } from '../plugin/setup-element-executor.interface.js';
import type { SetupElement } from '../plugin/setup-element.interface.js';

export interface SetupElementFileSymlink extends SetupElement<'file-symlink'> {
	sourceFile: string;
}

export const setupElementFileSymlinkExecutor: SetupElementExecutor<SetupElementFileSymlink> = {
	type: 'file-symlink',
	apply: async (element, options): Promise<void> => {
		const filePath = join(options.cwd, element.targetFile);
		const drySymlink = dry(options.dry, symlink);
		await drySymlink(element.sourceFile, filePath);
		options.logger.info(`Symlink ${filePath}`);
	},
};
