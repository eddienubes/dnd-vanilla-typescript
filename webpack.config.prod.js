const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
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
    new CleanWebpackPlugin()
  ],

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['.ts', '.js']
  },


}