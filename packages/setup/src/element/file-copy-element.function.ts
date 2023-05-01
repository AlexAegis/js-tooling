import { dry } from '@alexaegis/common';
import type { GroupedSetupElementsWithMetadata } from '@alexaegis/setup-plugin';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';
import type { NormalizedSetupOptions } from '../ochestrator/setup.function.options.js';
import type { ItemOf } from '../ochestrator/types.interface.js';

export const applyFileCopyElement = async (
	copyElement: ItemOf<GroupedSetupElementsWithMetadata['file-copy']>,
	relativeFilePath: string,
	options: NormalizedSetupOptions
): Promise<void> => {
	options.logger.info(`Executing ${copyElement.name}`);
	const filePath = join(options.cwd, relativeFilePath);
	const dryCp = dry(options.dry, cp);
	await dryCp(copyElement.sourceFile, filePath);
	options.logger.info(`Copy ${filePath}`);
};
