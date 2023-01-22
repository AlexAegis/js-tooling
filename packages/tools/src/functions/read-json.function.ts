import { readFile } from 'node:fs/promises';

export const readJson = async <T>(path: string | undefined): Promise<T | undefined> => {
	if (path === undefined) {
		return undefined;
	}

	const rawJson = await readFile(path, {
		encoding: 'utf8',
	}).catch((error) => {
		console.error('error reading json', error);
		return undefined;
	});

	return rawJson ? JSON.parse(rawJson) : undefined;
};
