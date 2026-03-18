import { isNotNullish } from '../objects/is-not-nullish.function.js';

/**
 * Randomizes the placement of elements within an array, shuffling it.
 *
 * It mutates the input array!
 */
export function shuffleArray<T>(array: T[]): T[] {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		const temporaryValue = array[currentIndex];
		const randomValue = array[randomIndex];
		if (isNotNullish(temporaryValue) && isNotNullish(randomValue)) {
			array[currentIndex] = randomValue;
			array[randomIndex] = temporaryValue;
		}
	}

	return array;
}
