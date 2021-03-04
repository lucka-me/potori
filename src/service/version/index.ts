import versionData from 'data/version.json';
import umiData from 'data/umi.json';

/**
 * Version information
 */
export default class Version {

    readonly string: string;    // The version string, <app version>d<data version>-(lite|full)
    readonly full: boolean;     // Is the current instance a full (private) version

    constructor() {
        const published = document.URL.includes('lucka.moe');
        this.string = `${versionData.version}d${umiData.version}-${published ? 'lite' : 'full'} (${versionData.build})`;
        this.full = !published;
    }

}