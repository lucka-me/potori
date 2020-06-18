import { version as potoriVersion } from "../../package.json";
import { version as dataVersion } from "../data/status.json";

class Version {

    text: string;
    fullFeature: boolean;

    constructor() {
        const published = document.URL.includes('lucka.moe');
        this.text = `${potoriVersion}d${dataVersion}-${published ? 'lite' : 'full'}`;
        this.fullFeature = !published;
    }
}

export default new Version();