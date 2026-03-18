export const normalizeRegExpLikeToRegExp = (regExpLike: string | RegExp): RegExp => {
	return typeof regExpLike === 'string' ? new RegExp(regExpLike) : regExpLike;
};
