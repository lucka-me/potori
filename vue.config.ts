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
        msTileColor: '#3B1E5F',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black-translucent',
        manifestOptions: {
            description: 'Web App to Visualize Ingress Nominations',
            start_url: publicPath,
            scope: publicPath,
            display: 'standalone'
        }
    }
};

module.exports = options;