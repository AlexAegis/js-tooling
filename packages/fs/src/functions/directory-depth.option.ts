import type { Defined } from '@alexaegis/common';

export interface DirectoryDepthOption {
	/**
	 * How deep should it dive in the directory tree
	 *
	 * @default Infinity
	 */
	depth?: number | undefined;
}

export type NormalizedDirectoryDepthOption = Defined<DirectoryDepthOption>;

export const normalizeDirectoryDepthOption = (
	options?: DirectoryDepthOption,
): NormalizedDirectoryDepthOption => {
	return {
		depth: options?.depth ?? Number.POSITIVE_INFINITY,
	};
};
