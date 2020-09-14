import { version as potoriVersion } from "../../../package.json";
import { version as dataVersion } from "../../data/status.json";

/**
 * Version information
 */
class Version {

    readonly string: string;    // The version string, <app version>d<data version>-(lite|full)
    readonly full: boolean;     // Is the current instance a full (private) version

    constructor() {
        const published = document.URL.includes('lucka.moe');
        this.string = `${potoriVersion}d${dataVersion}-${published ? 'lite' : 'full'}`;
        this.full = !published;
    }

}

export default new Version();