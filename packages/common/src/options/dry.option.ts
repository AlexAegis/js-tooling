export interface DryOption {
	/**
	 * Actual operations are turned off when `dry` is set to true.
	 *
	 * For example
	 * Post requests won't be made, filesystem operations won't write,
	 * but still send get requests and read from filesystem.
	 *
	 * @defaultValue false
	 */
	dry?: boolean;
}

export type NormalizedDryOption = Required<DryOption>;

export const normalizeDryOption = (options?: DryOption): NormalizedDryOption => {
	return {
		dry: options?.dry ?? false,
	};
};
