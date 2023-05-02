import { dry } from '@alexaegis/common';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { SetupElementExecutor } from '../plugin/setup-element-executor.interface.js';
import type { SetupElement } from '../plugin/setup-element.interface.js';
import { setupElementFileCopyExecutor } from './file-copy-element.js';

/**
 * Removes the target file(s). Will conflict with 'file-copy' if you try to
 * write and remove the same file.
 */
export type SetupElementFileRemove = SetupElement<'file-remove'>;

export const setupElementFileRemoveExecutor: SetupElementExecutor<SetupElementFileRemove> = {
	type: 'file-remove',
	conflictsOnTargetLevel: [setupElementFileCopyExecutor.type],
	apply: async (element, options): Promise<void> => {
		const filePath = join(options.cwd, element.targetFile);
		const dryRm = dry(options.dry, rm);
		await dryRm(filePath);
		options.logger.info(`Removing ${filePath}`);
	},
};
