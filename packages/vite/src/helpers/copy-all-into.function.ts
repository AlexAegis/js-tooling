import { existsSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';

export const copyAllInto = async (sourceFiles: string[], outDirectory: string): Promise<void> => {
	await Promise.all(
		sourceFiles
			.map((sourceFile) => ({ sourceFile, targetFile: join(outDirectory, sourceFile) }))
			.filter(({ targetFile }) => !existsSync(targetFile))
			.map(({ sourceFile, targetFile }) =>
				cp(sourceFile, targetFile, {
					preserveTimestamps: true,
					recursive: true,
				})
			)
	);
};
