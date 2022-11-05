import { extname } from 'node:path';

export const stripFileExtension = (name: string): string =>
	name.replace(new RegExp(`${extname(name)}$`), '');
