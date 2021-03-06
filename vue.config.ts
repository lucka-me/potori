import path from 'path';
import { execSync } from 'child_process';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { ProjectOptions } from '@vue/cli-service';

let next = true;
try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    next = branch === 'dev';
} catch(error) {

}

const publicPath = next ? '/next/' : '/';

const options: ProjectOptions = {
    publicPath: publicPath,
    pwa: {
        name: 'Potori',
        themeColor: '#3B1E5F',
        msTileColor: '#2578B5',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black-translucent',
        iconPaths: {
            faviconSVG: null,
            favicon16: null,
            favicon32: 'assets/icon-transparent.png',
            appleTouchIcon: 'assets/icon-maskable.png',
            maskIcon: null,
            msTileImage: 'assets/icon-transparent.png',
        },
        manifestOptions: {
            description: 'Web App to Visualize Ingress Nominations',
            start_url: publicPath,
            scope: publicPath,
            display: 'standalone',
            background_color: '#2578B5',
            icons: [
                {
                    src: `${publicPath}assets/icon-maskable.png`,
                    sizes: '512x512',
                    purpose: 'maskable',
                },
                {
                    src: `${publicPath}assets/icon-rounded.png`,
                    sizes: '512x512',
                    purpose: 'any',
                },
            ]
        }
    },
    chainWebpack: config => {
        config
            .plugin('bundle-analyzer')
            .use(BundleAnalyzerPlugin)
            .init((Plugin: typeof BundleAnalyzerPlugin) => new Plugin({
                analyzerMode: 'static', openAnalyzer: false
            }));
    },
};

module.exports = options;