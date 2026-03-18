export function random(min: number, max: number): number {
	if (min > max) {
		[min, max] = [max, min];
	}

	return Math.floor(Math.random() * (max - min + 1) + min);
}
