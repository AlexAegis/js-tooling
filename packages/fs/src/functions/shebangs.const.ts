export const SHEBANG_SEQUENCE = '#!';
export const SHELL_SHEBANG = '#!/usr/bin/env sh';
export const NODE_SHEBANG = '#!/usr/bin/env node';
export const TSNODE_SHEBANG = '#!/usr/bin/env node --require ts-node/register';

export const shebangs: Record<string, string> = {
	['.js']: NODE_SHEBANG,
	['.cjs']: NODE_SHEBANG,
	['.mjs']: NODE_SHEBANG,
	['.ts']: TSNODE_SHEBANG,
	['.mts']: TSNODE_SHEBANG,
	['.cts']: TSNODE_SHEBANG,
	['.sh']: SHELL_SHEBANG,
};
