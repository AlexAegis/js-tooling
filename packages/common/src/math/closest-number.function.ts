/**
 * It biases towards the smaller number. If the `<` would be `<=` then it
 * would bias towards the larger.
 */
export const closestNumber = (numbers: number[], target: number): number =>
	numbers.reduce((prev, curr) =>
		Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev,
	);
