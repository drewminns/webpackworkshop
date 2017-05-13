const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PROD = process.env.NODE_ENV === 'production';
const DEV = process.env.NODE_ENV === 'development';

const entry = PROD
  ? [ './src/script.js' ]
  : [
    './src/script.js',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080'
  ];

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      require('autoprefixer')()
    ]
  }
};

const plugins = PROD
  ? [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('style.css'),
  ]
  : [
      new webpack.HotModuleReplacementPlugin(),
    ];


const cssLoader = PROD
  ? ExtractTextPlugin.extract({
    use: ['css-loader?minimize=true', postcss, 'sass-loader']
  })
  : ['style-loader', 'css-loader', postcss, 'sass-loader']

module.exports = {
  entry,
  plugins,
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: '/node_modules/'
      },
      {
        test: /\.scss$/,
        use: cssLoader,
        exclude: '/node_modules/'
      },
      {
        test: /\.(png|gif|jpg)$/,
        use: ['url-loader?limit=30000&name=images/[hash:12].[ext]'],
        exclude: '/node_modules/'
      },
    ]
  }
}
