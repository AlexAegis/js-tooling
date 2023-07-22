import type { AbsolutePath } from './types.js';

export declare function isAbsolute(path: string): path is AbsolutePath;
export declare function toBaseHref(path: string | undefined): AbsolutePath | '';
