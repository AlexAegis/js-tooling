import { vi } from 'vitest';
import { mockPrettier } from '../src/mocks.js';

export const prettierMock = mockPrettier(vi);
export const resolveConfig = prettierMock.prettier.resolveConfig;
export const format = prettierMock.prettier.format;
export default prettierMock.prettier;
