import type { Config } from 'prettier';

export const mergeConfig = (baseConfig: Config, ...configs: Config[]): Config => {
	return configs.reduce((base, next) => {
		const overrides = [];
		if (base.overrides) {
			overrides.push(...base.overrides);
		}
		if (next.overrides) {
			overrides.push(...next.overrides);
		}

		const plugins = [];
		if (base.plugins) {
			plugins.push(...base.plugins);
		}
		if (next.plugins) {
			plugins.push(...next.plugins);
		}

		return { ...base, ...next, overrides, plugins };
	}, baseConfig);
};
