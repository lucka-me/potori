import { umi } from '@/service/umi';

import { StringKey } from './constants';

/**
 * Location
 */
export interface LngLat {
    lng: number;    // Longitude
    lat: number;    // Latitude
}

export interface NominationData {
    id: string;     // Short ID, also brainstorming ID
    title: string;  // Title
    image: string;  // Hash part of the image URL
    scanner: umi.ScannerCode;   // Scanner of the nomination

    status: umi.StatusCode; // Status code
    reasons?: Array<umi.ReasonCode>; // Reason codes

    confirmedTime: number;  // Confirmed time, the timestamp of confirmation mail
    confirmationMailId: string; // ID of confirmation mail
    resultTime?: number; // Result time, the timestamp of result mail
    resultMailId?: string;   // ID of result mail

    lngLat?: LngLat;    // Location
}

/**
 * Nomination data
 */
export default class Nomination implements NominationData {

    private static timestampSecondBound = 1E12;

    /**
     * Comparator for sorting by time
     */
    static readonly comparatorByTime = (a: Nomination, b: Nomination) => {
        const timeA = a.resultTime ? a.resultTime : a.confirmedTime;
        const timeB = b.resultTime ? b.resultTime : b.confirmedTime;
        return timeA < timeB ? 1 : -1;
    };

    id = '';
    title = '';
    image = '';
    scanner: umi.ScannerCode = umi.ScannerCode.Unknown;

    status: umi.StatusCode = umi.StatusCode.Pending;
    reasons: Array<umi.ReasonCode> = [];

    confirmedTime = 0;
    confirmationMailId = '';
    resultTime = 0;
    resultMailId = '';

    lngLat?: LngLat = undefined;

    /**
     * Get the image URL
     */
    get imageUrl(): string {
        return `https://lh4.googleusercontent.com/${this.image}`;
    }

    /**
     * Get Intel Maps URL
     */
    get intelUrl(): string {
        if (this.lngLat) {
            return `https://intel.ingress.com/intel?ll=${this.lngLat.lat},${this.lngLat.lng}&z=18`;
        } else {
            return 'https://intel.ingress.com/intel';
        }
    }

    /**
     * Get Brainstorming watermeter URL
     */
    get bsUrl(): string {
        return `https://brainstorming.azurewebsites.net/watermeter.html#${this.id}`;
    }

    get scannerData(): umi.Scanner {
        return umi.scanner.get(this.scanner)!;
    }

    /**
     * Get status data
     */
    get statusData(): umi.Status {
        return umi.status.get(this.status)!;
    }

    /**
     * Get data of reasons
     */
    get reasonsData(): Array<umi.Reason> {
        return this.reasons.map((code) => {
            return umi.reason.get(code)!;
        });
    }

    /**
     * Get the time of quota being restored
     */
    get restoreTime(): number {
        return this.confirmedTime + (14 * 24 * 3600 * 1000);
    }

    /**
     * Serialize to JSON
     */
    get data(): NominationData {
        let data: NominationData = {
            id: this.id,
            title: this.title,
            image: this.image,
            scanner: this.scanner,
            status: this.status,
            confirmedTime: this.confirmedTime / 1000,
            confirmationMailId: this.confirmationMailId,
        };
        if (this.reasons.length > 0) {
            data.reasons = this.reasons;
        }
        if (this.resultTime) data.resultTime = this.resultTime / 1000;
        if (this.resultMailId) data.resultMailId = this.resultMailId;
        if (this.lngLat) {
            data.lngLat = {
                lng: this.lngLat.lng,
                lat: this.lngLat.lat
            };
        }
        return data;
    }

    /**
     * Merge from another nomination
     * @param nomination The nomination to merge from
     * @returns Succeed or not
     */
    merge(nomination: Nomination): boolean {
        if (this.id !== nomination.id) return false;
        if (this.status === umi.StatusCode.Pending) {
            this.title = nomination.title;
            this.status = nomination.status;
            this.reasons = nomination.reasons;
            this.resultTime = nomination.resultTime;
            this.resultMailId = nomination.resultMailId;
        } else {
            this.confirmedTime = nomination.confirmedTime;
            this.confirmationMailId = nomination.confirmationMailId;
        }
        if (!this.lngLat) {
            this.lngLat = nomination.lngLat;
        }
        return true;
    }

    /**
     * Parse nomination from JSON
     * @param data Raw data to be parsed
     * @throws An `Error` when JSON missing `id`, `title` or `image`
     */
    static from(data: NominationData): Nomination {
        if (!data.id) throw new Error(StringKey.messageParseErrorMissingId);
        if (!data.title) throw new Error(StringKey.messageParseErrorMissingTitle);
        if (!data.image) throw new Error(StringKey.messageParseErrorMissingImage);

        // Fix old issues
        const image = data.image.replace('\r', '');

        // Test format
        if (!/^[a-zA-Z0-9]+$/.test(data.id)) {
            throw new Error(StringKey.messageParseErrorInvalidId);
        }
        if (!/^[0-9a-zA-Z\-\_]+$/.test(image)) {
            throw new Error(StringKey.messageParseErrorInvalidImage);
        }

        const nomination = new Nomination();
        nomination.id = data.id;
        nomination.title = data.title;
        nomination.image = image;

        if (data.scanner) {
            nomination.scanner = data.scanner;
        }

        if (data.status === umi.StatusCode.Pending) {
            nomination.status = umi.StatusCode.Pending;
        } else if (data.status === umi.StatusCode.Accepted) {
            nomination.status = umi.StatusCode.Accepted;
        } else {
            nomination.status = umi.StatusCode.Rejected;
            if (data.status !== umi.Reason.undeclared) {
                if (umi.reason.has(data.status)) {
                    nomination.reasons.push(data.status);
                }
            }
        }
        if (data.reasons) {
            for (const code of data.reasons) {
                if (umi.reason.has(code) && !nomination.reasons.includes(code)) {
                    nomination.reasons.push(code);
                }
            }
        }

        nomination.confirmedTime = data.confirmedTime > Nomination.timestampSecondBound ? data.confirmedTime : data.confirmedTime * 1000;
        nomination.confirmationMailId = data.confirmationMailId;

        if (data.resultTime) nomination.resultTime = data.resultTime > Nomination.timestampSecondBound ? data.resultTime : data.resultTime * 1000;
        if (data.resultMailId) nomination.resultMailId = data.resultMailId;

        if (data.lngLat) {
            nomination.lngLat = {
                lng: data.lngLat.lng,
                lat: data.lngLat.lat,
            }
        }
        return nomination;
    }

    /**
     * Convert hash part of image URL to short ID
     * @param imgUrl Hash part of the image URL
     */
    static parseId(imgUrl: string): string {
        return imgUrl.replace(/[^a-zA-Z0-9]/g, '').slice(-10).toLowerCase();
    }
}

/**
 * Callback for Array<Nomination>.filter()
 */
export type Predicator = (nomination: Nomination) => boolean;