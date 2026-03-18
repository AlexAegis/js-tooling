/**
 * /\r?\n/;
 */
export const NEWLINE = /\r?\n/;

/**
 * /\s+/;
 */
export const WHITESPACE = /\s+/;

/**
 * Two new lines in succession
 *
 * /\r?\n\r?\n/;
 */
export const DOUBLE_NEWLINE = /\r?\n\r?\n/;

/**
 * Everything after the first # symbol
 * /#.*$/;
 */
export const HASH_COMMENT = /#.*$/;
