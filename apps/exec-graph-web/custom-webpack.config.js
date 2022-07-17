/**
 * Because this app uses the Web Worker implementation of RemoteDataSource
 * and the N3Leyers import of queue-microtask qhich references global,
 * we have to define it here.
 *
 * This can hopefully be removed if n3 drops this dependency.
 */

var webpack = require('webpack');
const { merge } = require('webpack-merge');
const getDefaultConfig = require('@nrwl/react/plugins/webpack');

module.exports = (config) => {
  return merge(getDefaultConfig(config), {
    plugins: [
      new webpack.DefinePlugin({
        global: {},
      }),
    ],
  });
};
