import { distribute } from '../functions/distribute.function.js';

if (process.argv[2]) {
	console.log('!DISTRIBUTE!');
	distribute(process.argv[2], { dependencyCriteria: [process.argv[3]] });
}
