const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileSystem = require('fs');
const rmdir = require('rimraf');

let envToBeInjected = {
  MODE: process.env.MODE
};

let M = envToBeInjected.MODE.replace(/\s/g, '');

if (M === 'production') {
  return ;
}

module.exports = {
  // devtool: 'source-map',
  entry: {
    'main': './src/js/main.js'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  plugins: [
    new ExtractTextPlugin('css/[name].css', {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(envToBeInjected)
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false,
        // drop_console: true,
      }
    }),
    new HtmlWebpackPlugin({
      template: 'src/html/main.pug',
      filename: 'main.html',
      // chunks: ['global', 'index'],
    }),
  ],
  module: {
    // target: 'node',
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders: [
      {
        test: /\.pug$/,
        loaders: ['pug-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: "css-loader!less-loader" })
      },
      {
        test: /\.(eot|ttf|svg|png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=100000000'
      }
    ]
  }
}
