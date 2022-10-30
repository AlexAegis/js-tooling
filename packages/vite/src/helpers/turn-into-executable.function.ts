import { chmodSync, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const shebang = '#!/usr/bin/env node';

export const turnIntoExecutable = (file: string): void => {
	if (!existsSync(file)) {
		console.error(`can't turn ${file} into executable, doesn't exist`);
	}
	const fileStats = statSync(file);
	if (!fileStats.isFile()) {
		console.error(`can't turn ${file} into executable, not a file`);
	}
	const rawFile = readFileSync(file, {
		encoding: 'utf8',
	});
	if (!rawFile.startsWith(shebang)) {
		console.log(`prepending ${file} with shebang: ${shebang}`);

		const rawFileWithShebang = `${shebang}\n\n${rawFile}`;
		writeFileSync(file, rawFileWithShebang);
	}

	if (!(fileStats.mode & 0o111)) {
		console.log(`marking ${file} as executable...`);
		chmodSync(file, 0o744);
	}
};
