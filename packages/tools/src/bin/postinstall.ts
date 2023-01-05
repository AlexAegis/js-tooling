import { distribute } from '../functions/distribute.function.js';

if (process.argv[2]) {
	console.log('!DISTRIBUTE!');
	const criteria = process.argv[3];
	distribute(process.argv[2], { dependencyCriteria: criteria ? [criteria] : [] });
}
