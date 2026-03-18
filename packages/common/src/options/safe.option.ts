export interface SafeOption {
	/**
	 * Perform extra safety checks, could result in much less actions taken
	 *
	 * @defaultValue false
	 */
	safe?: boolean;
}

export type NormalizedSafeOption = Required<SafeOption>;

export const normalizeSafeOption = (options?: SafeOption): NormalizedSafeOption => {
	return {
		safe: options?.safe ?? false,
	};
};
