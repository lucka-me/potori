import StatusKit, { Status } from "./StatusKit";

interface LngLat {
    lng: number;
    lat: number;
}

class Nomination {
    id = '';
    title = '';
    image = '';

    status: Status = StatusKit.codes.get(0);

    confirmedTime = 0;
    confirmationMailId = '';
    resultTime: number = null;
    resultMailId: string = null;

    lngLat: LngLat = null;

    get imageUrl(): string {
        return `https://lh3.googleusercontent.com/${this.image}`;
    }

    get intelUrl(): string {
        return `https://intel.ingress.com/intel?ll=${this.lngLat.lat},${this.lngLat.lng}&z=18`;
    }

    get json(): any {
        let json: any = {
            title: this.title,
            image: this.image,
            status: this.status.code,
            confirmedTime: this.confirmedTime,
            confirmationMailId: this.confirmationMailId,
        };
        if (this.resultTime) json.resultTime = this.resultTime;
        if (this.resultMailId) json.resultMailId = this.resultMailId;
        if (this.lngLat) {
            json.lngLat = {
                lng: this.lngLat.lng,
                lat: this.lngLat.lat
            };
        }
        return json;
    }

    static from(json: any) {
        const nomination = new Nomination();
        nomination.id = json.id;
        nomination.title = json.title;
        nomination.image = json.image;

        nomination.status = StatusKit.codes.get(json.status);

        nomination.confirmedTime = json.confirmedTime;
        nomination.confirmationMailId = json.confirmationMailId;

        if (json.resultTime) nomination.resultTime = json.resultTime;
        if (json.resultMailId) nomination.resultMailId = json.resultMailId;

        if (json.lngLat) {
            nomination.lngLat = {
                lng: json.lngLat.lng,
                lat: json.lngLat.lat,
            }
        }
        return nomination;
    }
}

export default Nomination;
export { LngLat };