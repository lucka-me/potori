import { execSync } from 'child_process';
import { ProjectOptions } from '@vue/cli-service';

let next = true;
try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: "utf-8" }).trim();
    next = branch === 'dev';
} catch(error) {

}

const options: ProjectOptions = {
    publicPath: next ? '/next/' : '/',
};

module.exports = options;