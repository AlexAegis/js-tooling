import { dry } from '@alexaegis/common';
import type { GroupedSetupElementsWithMetadata } from '@alexaegis/setup-plugin';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { NormalizedSetupOptions } from '../ochestrator/setup.function.options.js';
import type { ItemOf } from '../ochestrator/types.interface.js';

export const applyFileRemoveElement = async (
	removeElement: ItemOf<GroupedSetupElementsWithMetadata['file-remove']>,
	relativeFilePath: string,
	options: NormalizedSetupOptions
): Promise<void> => {
	options.logger.info(`Executing ${removeElement.name}`);
	const filePath = join(options.cwd, relativeFilePath);
	const dryRm = dry(options.dry, rm);
	await dryRm(filePath);
	options.logger.info(`Removing ${filePath}`);
};
