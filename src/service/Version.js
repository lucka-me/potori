class Version {
    constructor() {
        const lite = document.URL.includes('lucka.moe');
        this.code = lite ? 'lite' : 'full';
        this.fullFeature = !lite;
    }
}

export default new Version();