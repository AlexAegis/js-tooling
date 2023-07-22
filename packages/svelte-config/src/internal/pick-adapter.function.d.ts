import type { Adapter, Platform } from './types.js';

export declare function isPlatform(platform: string | undefined): platform is Platform;
export declare function normalizePlatform(platform: string | undefined): Platform;
export declare function pickAdapter(platform: Platform | undefined): Adapter;
