export const yes = () => true;

export const yesAsync = (mode: 'micro' | 'macro' = 'micro') =>
	new Promise((resolve) => {
		if (mode === 'micro') {
			resolve(true);
		} else {
			setTimeout(() => {
				resolve(true);
			}, 0);
		}
	});
