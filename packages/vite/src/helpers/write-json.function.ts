import { writeFileSync } from 'node:fs';
import { prettify } from './prettify.function';

export interface WriteJsonOptions {
	/**
	 * Formats the json file using prettier and your configuration.
	 *
	 * Disable if you don't have prettier
	 *
	 * @default true
	 */
	autoPrettier?: boolean;
	/**
	 * If it's a dry run, nothing will be written to the disk, instead it will
	 * log it out.
	 *
	 * @default false
	 */
	dry?: boolean;
}

export const writeJsonSync = (
	record: Record<string, unknown>,
	path: string,
	options?: WriteJsonOptions
): void => {
	const raw = JSON.stringify(record);
	const dry = options?.dry ?? false;
	const autoPrettier = options?.autoPrettier ?? true;

	if (autoPrettier) {
		prettify(raw)
			.then((formatted) => {
				if (!dry) {
					writeFileSync(path, formatted);
				} else {
					console.log('dry pretty write to', path, 'file content:', formatted);
				}
			})
			.catch((error) => {
				console.error('error during json prettify', error);
				if (!dry) {
					writeFileSync(path, raw);
				} else {
					console.log('dry write to', path, 'file content:', raw);
				}
			});
	} else {
		if (!dry) {
			writeFileSync(path, raw);
		} else {
			console.log('dry, unformatted write to', path, 'file content:', raw);
		}
	}
};
