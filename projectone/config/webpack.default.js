var path = require('path');
var webpack = require('webpack');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEVELOPMENT = process.env.NODE_ENV === 'development';

var entry = PRODUCTION
  ? [ './src/script.js' ]
  : [
    './src/script.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080'
  ]

var plugins = PRODUCTION
  ? []
  : [ new webpack.HotModuleReplacementPlugin() ];

module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: '/node_modules/'
      }
    ]
  }
}
