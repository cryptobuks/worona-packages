var path = require('path');
var webpack = require('webpack');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

module.exports = function(packageJson) {
  var worona = packageJson.worona = packageJson.worona || {};

  return {
    entry: {
      main: path.resolve('src', 'index.js'),
    },
    output: {
      path: path.resolve('dist', 'dev'),
      publicPath: 'https://cdn.worona.io/packages/' + packageJson.name + '/dist/dev/',
      filename: 'js/' + worona.slug + '.' + worona.service + '.' + worona.type + '.[chunkhash].js',
      library: worona.slug + '_' + worona.service + '_' + worona.type,
      libraryTarget: 'commonjs2',
      hashDigestLength: 32,
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /(node_modules)/,
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'file-loader?name=images/[name].[chunkhash].[ext]',
          exclude: /(node_modules)/,
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&minetype=application/font-woff&name=fonts/[name].[chunkhash].[ext]',
          exclude: /(node_modules)/,
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader?name=fonts/[name].[chunkhash].[ext]',
          exclude: /(node_modules)/,
        },
        {
          test: /\.json$/,
          loader: 'json-loader?name=jsons/[name].[chunkhash].[ext]',
          exclude: /(node_modules)/,
        },
      ],
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    postcss: function () {
      return [require('postcss-cssnext')()];
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') } }),
      new webpack.DllReferencePlugin({
        context: '../..',
        manifest: require('./dev-vendors-manifest.json'),
      }),
      new StatsWriterPlugin({
        filename: '../../package.json',
        fields: ['chunks'],
        transform: function (data) {
          worona.dev = worona.dev || {};
          worona.dev.files = [];
          data.chunks.forEach(chunk => chunk.files.forEach((file, index) => {
              const chunkName = chunk.names[index];
              if (chunkName === 'main') {
                worona.dev.main = packageJson.name + '/dist/dev/' + file;
              }
              worona.dev.files.push({
                file: packageJson.name + '/dist/dev/' + file,
                hash: chunk.hash,
                chunkName: chunkName });
            }));
          return JSON.stringify(packageJson, null, 2);
        }
      }),
    ],
  };
};
