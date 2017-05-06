const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.default.js');
const path = require('path');

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  hot: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});
server.listen(8080, 'localhost');
