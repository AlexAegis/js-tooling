import type { JsonMatcherFrom } from '@alexaegis/match';
import type { PackageJson } from '@alexaegis/workspace-tools';

export type PackageJsonFilter = JsonMatcherFrom<PackageJson>;
