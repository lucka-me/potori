import i18next from 'i18next';

import { service } from 'service';
import { Status } from 'service/status';

const now = Date.now();

/**
 * Location
 */
export interface LngLat {
    lng: number;    // Longitude
    lat: number;    // Latitude
}

/**
 * Nomination data
 */
export default class Nomination {

    id = '';    // Short ID, also brainstorming ID
    title = ''; // Title
    image = ''; // Hash part of the image URL

    status: Status = null;  // Status of nomination

    confirmedTime = 0;              // Confirmed time, the timestamp of confirmation mail
    confirmationMailId = '';        // ID of confirmation mail
    resultTime: number = null;      // Result time, the timestamp of result mail
    resultMailId: string = null;    // ID of result mail

    lngLat: LngLat = null;  // Location

    /**
     * Get the image URL
     */
    get imageUrl(): string {
        return `https://lh3.googleusercontent.com/${this.image}`;
    }

    /**
     * Get Intel Maps URL
     */
    get intelUrl(): string {
        return `https://intel.ingress.com/intel?ll=${this.lngLat.lat},${this.lngLat.lng}&z=18`;
    }

    /**
     * Get Brainstorming watermeter URL
     */
    get bsUrl(): string {
        return `https://brainstorming.azurewebsites.net/watermeter.html#${this.id}`;
    }

    /**
     * Get the time of quota being restored
     */
    get restoreTime(): number {
        return this.confirmedTime + (14 * 24 * 3600 * 1000);
    }

    /**
     * Get the string of confirmedTime
     */
    get confirmedDateString(): string {
        if (this.confirmedTime > 0) {
            return new Date(this.confirmedTime).toLocaleDateString();
        }
        return i18next.t('service.nomination.missing');
    }

    /**
     * Get the string of resultTime
     */
    get resultDateString(): string {
        return new Date(this.resultTime).toLocaleDateString();
    }

    /**
     * Get string of interval between confirmedTime and resultTime or now
     */
    get intervalString(): string {
        const end = this.resultTime ? this.resultTime : now;
        return i18next.t('service.nomination.day', {
            count: Math.floor((end - this.confirmedTime) / (24 * 3600 * 1000))
        });
    }

    /**
     * Get string of interval between now and restore time
     */
    get restoreIntervalString(): string {
        return i18next.t('service.nomination.day', {
            count: Math.floor((this.restoreTime - now) / (24 * 3600 * 1000))
        });
    }

    /**
     * Serialize to JSON
     */
    get json(): any {
        let json: any = {
            id: this.id,
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

    /**
     * Parse nomination from JSON
     * @param json JSON to be parsed
     * @throws An `Error` when JSON missing `id`, `title`, `image` or `confirmedTime`
     */
    static parse(json: any): Nomination {
        if (!json.id) throw new Error('message:service.nomination.parseNoId');
        if (!json.title) throw new Error('message:service.nomination.parseNoTitle');
        if (!json.image) throw new Error('message:service.nomination.parseNoImage');
        if (!json.confirmedTime) throw new Error('message:service.nomination.parseNoConfirmedTime');

        // Fix old issues
        const image = (json.image as string).replace('\r', '');

        // Test format
        if (!/^[a-zA-Z0-9]+$/.test(json.id)) {
            throw new Error('message:service.nomination.parseFormatId');
        }
        if (!/^[0-9a-zA-Z\-\_]+$/.test(image)) {
            throw new Error('message:service.nomination.parseFormatImage');
        }

        const nomination = new Nomination();
        nomination.id = json.id;
        nomination.title = json.title;
        nomination.image = image;

        nomination.status = service.status.codes.get(json.status);

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

    /**
     * Convert hash part of image URL to short ID
     * @param imgUrl Hash part of the image URL
     */
    static parseId(imgUrl: string): string {
        return imgUrl.replace(/[^a-zA-Z0-9]/g, '').slice(- 10).toLowerCase();
    }
}