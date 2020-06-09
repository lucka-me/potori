import { version as potoriVersion } from "../../package.json";
import { version as dataVersion } from "../data/status.json";

class Version {

    text: string = '';
    fullFeature: boolean = false;

    constructor() {
        const lite = document.URL.includes('lucka.moe');
        this.text = `${potoriVersion}d${dataVersion}-${lite ? 'lite' : 'full'}`;
        this.fullFeature = !lite;
    }
}

export default new Version();