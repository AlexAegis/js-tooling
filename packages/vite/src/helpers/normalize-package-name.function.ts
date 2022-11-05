/**
 * Takes out the @ in front of a packageName and replaces / with a -
 */
export const normalizePackageName = (packageName: string | undefined): string => {
	return packageName?.replace(/^@/, '')?.replace('/', '-') ?? '';
};
