import type { Defined } from '@alexaegis/common';
import { DEFAULT_EXPORT_FORMATS } from '@pakk/core';
import type { LibraryFormats } from 'vite';

export interface PakkStandaloneOptions {
	/**
	 * @defaultValue ['es', 'cjs']
	 */
	formats?: LibraryFormats[] | undefined;
}

export type NormalizedPakkStandaloneOptions = Defined<PakkStandaloneOptions>;

export const normalizePakkStandaloneOptions = (
	options?: PakkStandaloneOptions,
): NormalizedPakkStandaloneOptions => {
	return {
		formats: options?.formats ?? DEFAULT_EXPORT_FORMATS,
	};
};
