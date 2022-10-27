import type { ModuleFormat } from 'rollup';

/**
 * Default rollup behavior.
 *
 * TODO: figure out how to plug this into rollup output naming. I can't get the format there
 * @param format
 * @param entryName
 * @returns
 */
export const bundleFileNameFormatter = (
	format: ModuleFormat,
	entryName: string,
	packageType: 'module' | 'commonjs' = 'commonjs'
) => {
	switch (format) {
		case 'es':
		case 'esm': {
			return packageType === 'module' ? `${entryName}.js` : `${entryName}.mjs`;
		}
		case 'cjs': {
			return packageType === 'commonjs' ? `${entryName}.js` : `${entryName}.cjs`;
		}
		default: {
			return `${entryName}.${format}.js`;
		}
	}
};
