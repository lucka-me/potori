const path = require('path');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const cdnConfig = {
  modules: [
    {
      name:     '@fortawesome/fontawesome-free',
      cdn:      'font-awesome',
      cssOnly:  true,
      styles: [
        'css/fontawesome.min.css',
        'css/solid.min.css'
      ],
      webfonts: [
        'webfonts/fa-solid-900.ttf',
        'webfonts/fa-solid-900.woff2'
      ]
    },
  ],
  prodUrl: 'https://cdnjs.cloudflare.com/ajax/libs/:name/:version/:path'
};

module.exports = {
  entry: { potori: './src/index.ts', },
  output: {
    filename: 'lib/[name].[chunkhash].js',
    chunkFilename: 'lib/[name].[chunkhash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
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
    alias: {
      root: path.join(__dirname, 'src', '../'),

      data:     path.join(__dirname, 'src', 'data'),
      locales:  path.join(__dirname, 'src', 'locales'),
      service:  path.join(__dirname, 'src', 'service'),
      ui:       path.join(__dirname, 'src', 'ui'),
    },
    extensions: [ '.ts', '.js' ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: true,
      }),
    ],
    splitChunks: {
      chunks: 'initial',
      minSize: 1,
      maxInitialRequests: 15,
      cacheGroups: {
        service: {
          test: /[\\/]src[\\/]service[\\/]/,
          name: 'service',
          priority: 40,
        },
        ui: {
          test: /[\\/]src[\\/]ui[\\/]/,
          name: 'ui',
          priority: 40,
        },
        uiAsync: {
          test: /[\\/]src[\\/]ui[\\/]/,
          name: 'ui-async',
          chunks: 'async',
          priority: 40,
          reuseExistingChunk: true,
        },

        data: {
          test: /[\\/]src[\\/](data|locales)[\\/]/,
          name: 'data',
          priority: 30,
        },

        mdc: {
          test: /[\\/]node_modules[\\/]@material/,
          name: 'mdc',
          priority: 20,
          reuseExistingChunk: true,
        },
        mdcAsync: {
          test: /[\\/]node_modules[\\/]@material/,
          name: 'mdc-async',
          priority: 20,
          chunks: 'async',
          reuseExistingChunk: true,
        },

        modules: {
          test: /[\\/]node_modules[\\/]/,
          name: 'modules',
          priority: 10,
          reuseExistingChunk: true,
        },
        modulesAsync: {
          test: /[\\/]node_modules[\\/]/,
          name: 'modules-async',
          priority: 10,
          chunks: 'async',
          reuseExistingChunk: true,
        },
      },
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 8000,
    contentBasePublicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new WebpackCdnPlugin(cdnConfig),
    new HtmlWebpackPlugin({
      title: 'Potori',
      inject: true,
      favicon: 'assets/icon.png',
      scriptLoading: 'defer',
      chunks: [ 'potori' ],
      filename: 'index.html',
      meta: {
        'description' : 'Web App to Visualize Ingress Nominations',
        'viewport'    : 'width=device-width, height=device-height, initial-scale=1',
      },
      template: './src/templates/potori.tpl',
    }),
    new WebpackPwaManifest({
      name: 'Potori',
      description: 'Web App to Visualize Ingress Nominations',
      filename: 'manifest.webmanifest',
      fingerprints: false,
      orientation: 'any',
      start_url: '/',
      scope: '/',
      background_color: '#2578B5',
      theme_color: '#3B1E5F',
      ios: {
        'apple-mobile-web-app-status-bar-style': 'black'
      },
      icons: [
        {
          src: path.resolve('assets/icon.png'),
          size: 180,
          destination: path.join('assets'),
          purpose: 'maskable any',
          ios: true,
        },
        {
          src: path.resolve('assets/icon.png'),
          size: 512,
          destination: path.join('assets'),
          purpose: 'maskable any',
        }
      ],
    }),
    new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      additionalManifestEntries: [
        { url: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap', revision: null },
        { url: 'https://apis.google.com/js/api.js', revision: null },
        ...cdnConfig.modules.reduce((list, cdn) => {
          // Cache sources from CDN
          //if (cdn.prodUrl) return list;
          const version = WebpackCdnPlugin.getVersionInNodeModules(cdn.name);
          const base = cdnConfig.prodUrl
            .replace(':name', cdn.cdn || cdn.name)
            .replace(':version', version);
          //if (cdn.path) list.push({ url: base.replace(':path', cdn.path), revision: version });
          //if (cdn.style) list.push({ url: base.replace(':path', cdn.style), revision: version });
          if (cdn.styles) list.push(...cdn.styles.map((style) => {
            return { url: base.replace(':path', style), revision: version }
          }));
          if (cdn.webfonts) list.push(...cdn.webfonts.map((font) => {
            return { url: base.replace(':path', font), revision: version }
          }));
          return list;
        }, new Array<{ url: string, revision: string }>())
      ]
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};