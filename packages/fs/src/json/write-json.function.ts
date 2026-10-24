import { writeFile } from 'node:fs/promises';
import { tryPrettify } from '../format/try-prettify.function.js';
import { normalizeWriteJsonOptions, type WriteJsonOptions } from './write-json.function.options.js';

export const writeJson = async <
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- public API, callers may pass the type of data
	T extends Record<string | number, unknown> = Record<string | number, unknown>,
>(
	data: T,
	path: string,
	rawOptions?: WriteJsonOptions,
): Promise<void> => {
	const options = normalizeWriteJsonOptions(rawOptions);

	let content = JSON.stringify(data, undefined, 2);

	if (options.autoPrettier) {
		content = await tryPrettify(content, { ...options, parser: 'json-stringify' });
	}

	if (!options.dry) {
		await writeFile(path, content);
	}
};
