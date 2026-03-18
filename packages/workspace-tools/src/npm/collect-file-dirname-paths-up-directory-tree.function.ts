import { existsSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { PACKAGE_JSON_NAME } from '../package-json/package-json.interface.js';
import {
	normalizeCollectFileDirnamesUpDirectoryTreeOptions,
	type CollectFileDirnamesUpDirectoryTreeOptions,
	type NormalizedCollectFileDirnamesUpDirectoryTreeOptions,
} from './collect-file-dirname-paths-up-directory-tree.function.options.js';

export const collectFileDirnamePathsUpDirectoryTree = (
	fileName: string,
	rawOptions?: CollectFileDirnamesUpDirectoryTreeOptions,
): string[] => {
	const options = normalizeCollectFileDirnamesUpDirectoryTreeOptions(rawOptions);
	return collectFileDirnamePathsUpDirectoryTreeInternal(fileName, options, [], []);
};

const collectFileDirnamePathsUpDirectoryTreeInternal = (
	fileName: string,
	options: NormalizedCollectFileDirnamesUpDirectoryTreeOptions,
	resultCollection: string[],
	packageJsonCollection: string[],
): string[] => {
	const path = normalize(options.cwd);

	if (
		packageJsonCollection.length < options.maxPackages &&
		resultCollection.length < options.maxResults &&
		existsSync(join(path, fileName))
	) {
		resultCollection.unshift(path);
	}

	if (
		packageJsonCollection.length < options.maxPackages &&
		existsSync(join(path, PACKAGE_JSON_NAME))
	) {
		packageJsonCollection.unshift(path);
	}

	const parentPath = join(path, '..');
	if (
		parentPath !== path &&
		options.depth > 0 &&
		packageJsonCollection.length < options.maxPackages &&
		resultCollection.length < options.maxResults
	) {
		return collectFileDirnamePathsUpDirectoryTreeInternal(
			fileName,
			{ ...options, depth: options.depth - 1, cwd: parentPath },
			resultCollection,
			packageJsonCollection,
		);
	}

	return resultCollection;
};
