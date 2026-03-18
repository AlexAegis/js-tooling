export interface ForceOption {
	/**
	 * Ignore caches, guards, overwrite files
	 *
	 * @defaultValue false
	 */
	force?: boolean;
}

export type NormalizedForceOption = Required<ForceOption>;

export const normalizeForceOption = (options?: ForceOption): NormalizedForceOption => {
	return {
		force: options?.force ?? false,
	};
};
