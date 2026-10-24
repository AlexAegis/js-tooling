import { compareByCodeUnit } from '@alexaegis/common';
import type {
	PackageJson,
	PackageJsonExportConditions,
	PackageJsonExports,
} from '@alexaegis/workspace-tools';

export interface PublishedPackageFields {
	files: string[];
	publishConfigExports: PackageJsonExports | undefined;
}

const SOURCE_PREFIX = './src/';
const DIST_PREFIX = './dist/';

const isSourceDeclaration = (path: string): boolean =>
	path.startsWith(SOURCE_PREFIX) && path.endsWith('.d.ts');

const isTypesCondition = (condition: string | undefined): boolean =>
	condition === 'types' || !!condition?.startsWith('types@');

// npm and pnpm always pack these
const isAlwaysPacked = (path: string): boolean =>
	path === './package.json' || /^\.\/readme(\.[^/]*)?$/i.test(path);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === 'string');

const isSupportedPath = (path: unknown, condition?: string): path is string =>
	typeof path === 'string' &&
	path.startsWith('./') &&
	!path.split('/').includes('..') &&
	(!path.startsWith(SOURCE_PREFIX) ||
		(isTypesCondition(condition) ? /\.(ts|js)$/ : /\.(ts|js|cjs)$/).test(path));

const isSupportedExportTarget = (exportTarget: unknown): boolean => {
	if (!isPlainObject(exportTarget)) {
		return isSupportedPath(exportTarget);
	}

	const types = exportTarget['types'];
	const hasSourceDeclaration = typeof types === 'string' && isSourceDeclaration(types);

	return Object.entries(exportTarget).every(
		([condition, path]) =>
			isSupportedPath(path, condition) &&
			// toPublishedExport drops every js condition here, safe only for the empty build output in dist
			(!hasSourceDeclaration || isTypesCondition(condition) || path.startsWith(DIST_PREFIX)),
	);
};

// subpath keys with string or flat condition targets, nothing nested
const isSupportedExports = (exports: unknown): exports is PackageJsonExports =>
	isPlainObject(exports) &&
	Object.entries(exports).every(
		([subpath, exportTarget]) =>
			subpath.startsWith('.') && isSupportedExportTarget(exportTarget),
	);

const toDistPath = (path: string, condition?: string): string => {
	if (!path.startsWith(SOURCE_PREFIX) || isSourceDeclaration(path)) {
		return path;
	}

	const pathInSource = path.slice(SOURCE_PREFIX.length);
	const pathInDist = isTypesCondition(condition)
		? pathInSource.replace(/\.(ts|js)$/, '.d.ts')
		: pathInSource.replace(/\.ts$/, '.js');
	return DIST_PREFIX + pathInDist;
};

const toPublishedExport = (
	exportTarget: PackageJsonExportConditions | string,
): PackageJsonExportConditions | string => {
	if (typeof exportTarget === 'string') {
		return toDistPath(exportTarget);
	}

	// a handwritten declaration in src builds to an empty js file, so only its types are published
	const types = exportTarget.types;
	const conditions = Object.entries(exportTarget).filter(
		([condition]) =>
			types === undefined || !isSourceDeclaration(types) || isTypesCondition(condition),
	);

	return Object.fromEntries(
		conditions.map(([condition, path]) => [condition, toDistPath(path, condition)]),
	);
};

/**
 * Derives `files` and `publishConfig.exports` from `exports`, where the types
 * point into `src` for the workspace and into `dist` once published.
 *
 * Returns `undefined` for an `exports` or `files` shape it does not support.
 */
export const derivePublishedPackageFields = (
	packageJson: PackageJson,
): PublishedPackageFields | undefined => {
	const existingFiles: unknown = packageJson.files ?? [];
	if (
		!isStringArray(existingFiles) ||
		(packageJson.exports !== undefined && !isSupportedExports(packageJson.exports))
	) {
		return undefined;
	}

	const publishConfigExports = packageJson.exports
		? Object.fromEntries(
				Object.entries(packageJson.exports).map(([subpath, exportTarget]) => [
					subpath,
					toPublishedExport(exportTarget),
				]),
			)
		: undefined;

	const exportedPaths = Object.values(publishConfigExports ?? {})
		.flatMap((exportTarget) =>
			typeof exportTarget === 'string' ? exportTarget : Object.values(exportTarget),
		)
		.filter((path) => !isAlwaysPacked(path))
		.map((path) => {
			const relativePath = path.replace(/^\.\//, '');
			return relativePath.startsWith('src/') ? relativePath : relativePath.split('/', 1)[0];
		})
		.filter((path): path is string => !!path);

	const files = [...new Set([...existingFiles, 'dist', ...exportedPaths])].toSorted(
		compareByCodeUnit,
	);

	return { files, publishConfigExports };
};
