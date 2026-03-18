import { describe, expect, it } from 'vitest';
import { measureRegExpSpecificity } from './regex-specificity.function.js';

describe('measureRegExpSpecificity', () => {
	it('should return the length of the literal parts of a regexp source', () => {
		expect(measureRegExpSpecificity('asd.*', 'asd')).toEqual(3);
		expect(measureRegExpSpecificity('asd.*', 'asdrty')).toEqual(3);
	});
});
