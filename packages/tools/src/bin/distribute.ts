import { distributeFile } from '../functions/distribute-file.function.js';

if (process.argv[2]) {
	console.log('!DISTRIBUTE!');
	const criteria = process.argv[3];
	distributeFile(process.argv[2], { dependencyCriteria: criteria ? [criteria] : [] });
}
