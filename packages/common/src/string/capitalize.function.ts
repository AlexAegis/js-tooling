/**
 * Turns the first letter into upper case and the rest lowercase
 */
export const capitalize = (s: string): string => {
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};
