import { dry } from '@alexaegis/common';
import type { SetupElement, SetupElementExecutor } from '@alexaegis/setup-plugin';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';

export interface SetupElementFileCopy extends SetupElement<'file-copy'> {
	sourceFile: string;
}

export const setupElementFileCopyExecutor: SetupElementExecutor<SetupElementFileCopy> = {
	type: 'file-copy',
	apply: async (element, options): Promise<void> => {
		const filePath = join(options.cwd, element.targetFile);
		const dryCp = dry(options.dry, cp);
		await dryCp(element.sourceFile, filePath);
		options.logger.info(`Copy ${filePath}`);
	},
};
