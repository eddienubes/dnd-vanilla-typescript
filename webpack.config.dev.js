const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist'
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ],

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },


}