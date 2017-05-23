const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const PROD = process.env.NODE_ENV === 'production';
const DEV = process.env.NODE_ENV === 'development';

const entry = PROD
  ? [ './src/index.jsx' ]
  : [
    './src/index.jsx',
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false
    }),
    new ExtractTextPlugin('style-[contenthash:10].min.css'),
    new HTMLWebpackPlugin({
      template: 'config/template.html'
    })
  ]
  : [
      new webpack.HotModuleReplacementPlugin(),
    ];


const cssLoader = PROD
  ? ExtractTextPlugin.extract({
    use: [`css-loader?minimize=true`, postcss, 'sass-loader']
  })
  : ['style-loader', 'css-loader', postcss, 'sass-loader']

module.exports = {
  devtool: PROD ? 'cheap-module-source-map' : 'eval',
  entry,
  plugins,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: PROD ? '/' : '/dist/',
    filename: PROD ? 'bundle.[hash:12].min.js' : 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
