import type { PathLike, Stats } from 'node:fs';
import { vi } from 'vitest';

export const cpMock: ReturnType<typeof vi.fn<(a: string, b: string) => Promise<void>>> =
	vi.fn<(a: string, b: string) => Promise<void>>();
export const rmMock: ReturnType<typeof vi.fn<(a: string, b: string) => Promise<void>>> = vi.fn<
	(a: string, b: string) => Promise<void>
>(() => Promise.resolve());
export const symlinkMock: ReturnType<typeof vi.fn<(a: string, b: string) => Promise<void>>> = vi.fn<
	(a: string, b: string) => Promise<void>
>(() => Promise.resolve());
export const readFileMock: ReturnType<typeof vi.fn<(p: PathLike) => Promise<string | undefined>>> =
	vi.fn(
		(_path: PathLike): Promise<string | undefined> =>
			Promise.resolve('content ${relativePathFromPackageToRoot}'),
	);
export const writeFileMock: ReturnType<typeof vi.fn<(p: PathLike, s: string) => Promise<void>>> =
	vi.fn((_path: PathLike, _content: string): Promise<void> => Promise.resolve(undefined));
export const mkdirMock: ReturnType<typeof vi.fn<(_: string) => Promise<void>>> =
	vi.fn<(_: string) => Promise<void>>();

export const rm: ReturnType<typeof vi.fn<(a: string, b: string) => Promise<void>>> = vi.fn(
	(path: string, target: string) => rmMock(path, target),
);
export const symlink: ReturnType<typeof vi.fn<(a: string, b: string) => Promise<void>>> = vi.fn(
	(path: string, target: string) => symlinkMock(path, target),
);
export const mkdir: ReturnType<typeof vi.fn<(_: string) => Promise<void>>> = vi.fn((path: string) =>
	mkdirMock(path),
);

export const readFile: ReturnType<typeof vi.fn<(_: string) => Promise<string | undefined>>> = vi.fn(
	(path: string) => readFileMock(path),
);
export const writeFile: ReturnType<typeof vi.fn<(a: string, b: string) => Promise<void>>> = vi.fn(
	(path: string, content: string) => writeFileMock(path, content),
);

export const lstat: ReturnType<typeof vi.fn<(_: string) => Promise<Stats> | Promise<undefined>>> =
	vi.fn((path: string) => {
		switch (path) {
			case '/foo/bar/packages/rcfile':
			case '/foo/bar/packages/zed/trash':
			case '/foo/bar/packages/zed/package.json':
			case '/foo/bar/packages/zod/package.json':
			case '/foo/bar/packages/zed/rcfile': {
				return Promise.resolve({
					isFile: () => true,
					isSymbolicLink: () => false,
				} as Stats);
			}
			case '/foo/bar/packages/zod/rcfile': {
				return Promise.resolve({ isSymbolicLink: () => true } as Stats);
			}
			case '/foo/bar/packages/nonfile': {
				return Promise.resolve({ isFile: () => false } as Stats);
			}
			default: {
				return Promise.resolve(undefined);
			}
		}
	});
