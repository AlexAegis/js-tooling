import { linkToWorkspace } from '../functions/link-to-workspace.function.js';

if (process.argv[2]) {
	linkToWorkspace(process.argv[2]);
}
