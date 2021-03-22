import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as packageJSON from '../package.json';

export namespace version {
    export function build() {
        let buildNumber = '0';
        try {
            buildNumber = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
        } catch(error) {

        }

        const versionJSON = {
            version: packageJSON.version,
            build: buildNumber
        };

        writeFileSync('./src/data/version.json', JSON.stringify(versionJSON, null, 4));
        console.info(`Built version: ${packageJSON.version}, build: ${buildNumber}.`);
    }
}