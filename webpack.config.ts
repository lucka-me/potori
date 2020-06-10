const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    potori: './src/potori.ts',
    intro: './src/intro.ts',
  },
  output: {
    filename: 'lib/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 8000
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'potori.css',
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false,
      scriptLoading: 'defer',
      chunks: [ 'potori' ],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: 'intro.html',
      inject: false,
      scriptLoading: 'defer',
      chunks: [ 'intro' ],
      filename: 'intro/index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'manifest.json' },
      ],
    }),
  ],
};