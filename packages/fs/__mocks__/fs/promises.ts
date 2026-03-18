import type { Awaitable } from '@alexaegis/common';
import type { PathLike, Stats } from 'node:fs';
import { vi } from 'vitest';

export const mockWriteFile: ReturnType<
	typeof vi.fn<(p: PathLike, _: unknown) => Awaitable<undefined>>
> = vi.fn<(p: PathLike, _: unknown) => Awaitable<undefined>>(() => Promise.resolve(undefined));

const mockLstat: ReturnType<typeof vi.fn<(_: PathLike) => Awaitable<Stats | undefined>>> = vi.fn(
	(path: PathLike): Awaitable<Stats | undefined> =>
		new Promise((resolve) => {
			if (
				path.toString().endsWith('.sh') ||
				path.toString().endsWith('.txt') ||
				path.toString().endsWith('.js') ||
				path.toString().endsWith('.ts')
			) {
				resolve({
					isFile: () => true,
					mode: path.toString().includes('executable') ? 0o111 : 0o444,
				} as Stats);
			} else if (path.toString().endsWith('directory')) {
				resolve({ isFile: () => false } as Stats);
			} else {
				throw new Error('non existent!');
			}
		}),
);

export const mockChmod: ReturnType<typeof vi.fn<() => Promise<undefined>>> = vi.fn(() =>
	Promise.resolve(undefined),
);

export const mockReadFile: ReturnType<
	typeof vi.fn<(p: PathLike, _: unknown) => Awaitable<string>>
> = vi.fn<(p: PathLike, _: unknown) => Awaitable<string>>();

export const readFile: ReturnType<typeof vi.fn<(p: PathLike, _: unknown) => Awaitable<string>>> =
	mockReadFile;
export const writeFile: ReturnType<
	typeof vi.fn<(p: PathLike, _: unknown) => Awaitable<undefined>>
> = mockWriteFile;
export const lstat: ReturnType<typeof vi.fn<(_: PathLike) => Awaitable<Stats | undefined>>> =
	mockLstat;
export const chmod: ReturnType<typeof vi.fn<() => Promise<undefined>>> = mockChmod;
