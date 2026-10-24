import type { LoggerOption } from '@alexaegis/logging';
import { readFile } from 'node:fs/promises';

export const readJson = async <T = unknown>(
	path: string | undefined,
	options?: LoggerOption,
): Promise<T | undefined> => {
	if (path === undefined) {
		return undefined;
	}

	let rawJson: string;
	try {
		rawJson = await readFile(path, {
			encoding: 'utf8',
		});
	} catch (error) {
		options?.logger?.error('error reading json', error);
		return undefined;
	}

	if (!rawJson) {
		return undefined;
	}

	try {
		return JSON.parse(rawJson) as T;
	} catch {
		options?.logger?.error('error parsing json');
		return undefined;
	}
};
