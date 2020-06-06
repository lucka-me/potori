class Version {
    constructor() {
        const isPublic = document.URL.includes('lucka.moe');
        this.code = isPublic ? 'lite' : 'full';
        this.fullFeature = !isPublic;
    }
}

export default new Version();