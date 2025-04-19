import p from 'node:path';

const dtsExtension = '.d.ts';

/**
 * Removes extensions from filenames. Which is usually whatever `extname`
 * returns (everything after the last `.`) but in the case of `.d.ts` files,
 * it will strip `.d.ts` by default, unless turned off.
 */
export const stripFileExtension = (name: string, options?: { stripDts: boolean }): string => {
	const extension =
		name.endsWith(dtsExtension) && options?.stripDts !== false ? dtsExtension : p.extname(name);
	return name.replace(new RegExp(`${extension}$`), '');
};
