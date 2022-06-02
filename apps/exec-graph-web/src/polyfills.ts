/**
 * Polyfill stable language features. These imports will be optimized by `@babel/preset-env`.
 *
 * See: https://github.com/zloirock/core-js#babel
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

/**
 * Some dependency uses global, which is not available in the browser
 * Best workaround: https://github.com/nrwl/nx/issues/3673
 */
if (!('global' in window)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).global = window;
}
