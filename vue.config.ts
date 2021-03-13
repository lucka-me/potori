import { execSync } from 'child_process';
import { ProjectOptions } from '@vue/cli-service';

let next = true;
try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: "utf-8" }).trim();
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
            favicon32: null,
            appleTouchIcon: 'assets/icon-maskable.png',
            msTileImage: 'assets/icon-transparent.png',
        },
        manifestOptions: {
            description: 'Web App to Visualize Ingress Nominations',
            start_url: publicPath,
            scope: publicPath,
            display: 'standalone',
            icons: [
                {
                    src: `${publicPath}assets/icon-maskable.png`,
                    size: 512,
                    purpose: 'maskable',
                },
                {
                    src: `${publicPath}assets/icon-rounded.png`,
                    size: 512,
                    purpose: 'any',
                },
            ]
        }
    }
};

export default options;