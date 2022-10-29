import { distribute } from '../functions/distribute.function';

if (process.argv[2]) {
	console.log('!DISTRIBUTE!');
	distribute(process.argv[2], [process.argv[3]]);
}
