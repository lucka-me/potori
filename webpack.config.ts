const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
    new MiniCssExtractPlugin({
      filename: 'potori.css',
    }),
    new WebpackCdnPlugin({
      modules: [
        {
          name:   'chart.js',
          path:   'Chart.min.js',
          style:  'Chart.min.css',
        },
        {
          name: 'firebase',
          prodUrl: 'https://www.gstatic.com/:name/:version/:path',
          cdn: 'firebasejs',
          paths: [
            'firebase-app.js', 'firebase-database.js'
          ]
        },
        {
          name: 'mapbox-gl',
          var: 'mapboxgl',
          prodUrl: 'https://api.tiles.mapbox.com/:name/v:version/:path',
          cdn: 'mapbox-gl-js',
          path: 'mapbox-gl.js',
          style: 'mapbox-gl.css',
        },
        {
          name:   'material-components-web',
          var:    'mdc',
          path:   'material-components-web.min.js',
          style:  'material-components-web.min.css',
        },
        {
          name: 'moment',
          cdn:  'moment.js',
          path: 'moment.min.js',
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
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' },
        { from: 'manifest.json' },
      ],
    }),
  ],
};