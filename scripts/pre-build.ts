import { execSync } from 'child_process';
import { locale } from './build-locales';

locale.build();
const build = execSync('git rev-list --count HEAD', {
    encoding: "utf-8"
}).trim();
execSync(`sed -i "s/__BUILD_NUMBER__/${build}/" package.json`);
console.log(`Set build to ${build} in package.json.`);