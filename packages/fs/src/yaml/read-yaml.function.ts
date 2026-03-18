import { load } from 'js-yaml';
import { readFile } from 'node:fs/promises';

export const readYaml = async <T>(path: string | undefined): Promise<T | undefined> => {
	if (path === undefined) {
		return undefined;
	}

	const rawYaml = await readFile(path, {
		encoding: 'utf8',
	}).catch((error: unknown) => {
		console.error('error reading yaml', error);
		return undefined;
	});

	if (!rawYaml) {
		return undefined;
	}

	const result = load(rawYaml) as T;

	// If it's non-yaml it returns the raw string instead of throwing an error
	if (typeof result === 'string') {
		return undefined;
	}

	return result;
};
