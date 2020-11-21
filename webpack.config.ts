import * as webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { GenerateSW } from 'workbox-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';

const config: webpack.Configuration = {
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
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/'
                        }
                    }
                ],
            },
        ],
    },
    resolve: {
        alias: {
            root: path.join(__dirname, 'src', '../'),
            data: path.join(__dirname, 'src', 'data'),
            locales: path.join(__dirname, 'src', 'locales'),
            service: path.join(__dirname, 'src', 'service'),
            ui: path.join(__dirname, 'src', 'ui'),
            eli: path.join(__dirname, 'src', 'ui', 'eli'),
        },
        extensions: ['.ts', '.js'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: { comments: false, },
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
        new HtmlWebpackPlugin({
            title: 'Potori',
            inject: true,
            favicon: 'assets/icon.png',
            scriptLoading: 'defer',
            chunks: ['potori'],
            filename: 'index.html',
            meta: {
                'description': 'Web App to Visualize Ingress Nominations',
                'viewport': 'width=device-width, height=device-height, initial-scale=1',
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
                {
                    url: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
                    revision: null
                },
                {
                    url: 'https://apis.google.com/js/api.js',
                    revision: null
                },
            ]
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
};

export default config;