import { version as potoriVersion } from "../../../package.json";
import { version as dataVersion } from "../../data/status.json";

/**
 * Version information
 */
class Version {

    private published: boolean;

    constructor() {
        this.published = document.URL.includes('lucka.moe');
    }

    /**
     * Get the version string
     */
    get string() {
        return `${potoriVersion}d${dataVersion}-${this.published ? 'lite' : 'full'}`;
    }

    /**
     * Get if the current instance should be a full (private) version
     */
    get full() {
        return !this.published;
    }

}

export default new Version();