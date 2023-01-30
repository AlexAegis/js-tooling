/**
 * Only this config is imported uniquely from itself as other configs would
 * rely on this one being built first within this repository
 * ./src/config/base-vite.config.ts',
 *
 * This must make the package.json target the built artifacts since other
 * local packages vite.config.ts files are importing from this local package
 * and that cannot import '.ts' files outside from the compilation scope.
 *
 * https://vitejs.dev/config/
 */
export { default } from './src/library-vite.config.js';
