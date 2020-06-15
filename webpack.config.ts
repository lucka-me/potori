const path = require('path');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');

module.exports = {
  entry: {
    potori: './src/potori.ts',
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
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/potori.css',
    }),
    new WebpackCdnPlugin({
      modules: [
        {
          name: 'i18next',
          path: 'i18next.min.js'
        },
        {
          name: 'i18next-browser-languagedetector',
          var:  'i18nextBrowserLanguageDetector',
          path: 'i18nextBrowserLanguageDetector.min.js'
        },
        {
          name: 'moment',
          cdn:  'moment.js',
          path: 'moment.min.js',
        },
        {
          name:   'chart.js',
          var:    'Chart',
          cdn:    'Chart.js',
          path:   'Chart.min.js',
          style:  'Chart.min.css',
        },
        {
          name: 'firebase',
          paths: [
            'firebase-app.min.js', 'firebase-database.min.js'
          ]
        },
        {
          name: 'mapbox-gl',
          var: 'mapboxgl',
          path: 'mapbox-gl.min.js',
          style: 'mapbox-gl.min.css',
        },
        {
          name:   'material-components-web',
          var:    'mdc',
          path:   'material-components-web.min.js',
          style:  'material-components-web.min.css',
        },
      ],
      prodUrl: 'https://cdnjs.cloudflare.com/ajax/libs/:name/:version/:path'
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false,
      scriptLoading: 'defer',
      chunks: [ 'potori' ],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Redirecting',
      filename: 'intro/index.html',
      meta: {
        redirect: {
          'http-equiv': 'refresh',
          content: '0; url=https://lucka.moe/potori/docs',
        },
      },
      cdnModule: false,
      chunks: [],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'docs', to: 'docs' },
        { from: 'assets', to: 'assets' },
        { from: 'manifest.json' },
      ],
    }),
  ],
};