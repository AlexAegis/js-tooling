import type { ModuleFormat } from 'rollup';

/**
 * Default rollup behavior.
 *
 */
export const getBundledFileExtension = (
	format: ModuleFormat,
	packageType: 'module' | 'commonjs' = 'commonjs'
) => {
	switch (format) {
		case 'es':
		case 'esm': {
			return packageType === 'module' ? 'js' : 'mjs';
		}
		case 'cjs': {
			return packageType === 'commonjs' ? 'js' : 'cjs';
		}
		default: {
			return `${format}.js`;
		}
	}
};
