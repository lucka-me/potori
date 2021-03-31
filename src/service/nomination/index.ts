import { umi } from '@/service/umi';

enum ParseErrorReason {
    MISSING_ID = 'MISSING_ID',
    MISSING_TITLE = 'MISSING_TITLE',
    MISSING_IMAGE = 'MISSING_IMAGE',

    INVALID_ID = 'INVALID_ID',
    INVALID_IMAGE = 'INVALID_IMAGE'
}

/**
 * Location
 */
export interface LngLat {
    lng: number;    // Longitude
    lat: number;    // Latitude
}

export interface NominationJSON {
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

export interface NominationData extends NominationJSON {
    reasons: Array<umi.ReasonCode>;
    resultTime: number;
    resultMailId: string;
}

/**
 * Nomination data
 */
export default class Nomination implements NominationData {

    private static timestampSecondBound = 1E12;

    /**
     * Comparator for sorting by time
     */
    static readonly comparatorByTime = (a: NominationData, b: NominationData) => {
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

    get data(): NominationData {
        let data: NominationData = {
            id: this.id,
            title: this.title,
            image: this.image,
            scanner: this.scanner,
            status: this.status,
            reasons: this.reasons,
            confirmedTime: this.confirmedTime / 1000,
            confirmationMailId: this.confirmationMailId,
            resultTime: this.resultTime / 1000,
            resultMailId: this.resultMailId
        };
        if (this.lngLat) {
            data.lngLat = {
                lng: this.lngLat.lng,
                lat: this.lngLat.lat
            };
        }
        return data;
    }

    /**
     * Serialize to JSON
     */
    get json(): NominationJSON {
        let json: NominationJSON = {
            id: this.id,
            title: this.title,
            image: this.image,
            scanner: this.scanner,
            status: this.status,
            confirmedTime: this.confirmedTime / 1000,
            confirmationMailId: this.confirmationMailId,
        };
        if (this.reasons.length > 0) {
            json.reasons = this.reasons;
        }
        if (this.resultTime) json.resultTime = this.resultTime / 1000;
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
     * @param json Raw JSON to be parsed
     * @throws An `Error` when JSON missing `id`, `title` or `image`
     */
    static from(json: NominationJSON): Nomination {
        if (!json.id) throw new Error(ParseErrorReason.MISSING_ID);
        if (!json.title) throw new Error(ParseErrorReason.MISSING_TITLE);
        if (!json.image) throw new Error(ParseErrorReason.MISSING_IMAGE);

        // Fix old issues
        const image = json.image.replace('\r', '');

        // Test format
        if (!/^[a-zA-Z0-9]+$/.test(json.id)) {
            throw new Error(ParseErrorReason.INVALID_ID);
        }
        if (!/^[0-9a-zA-Z\-\_]+$/.test(image)) {
            throw new Error(ParseErrorReason.INVALID_IMAGE);
        }

        const nomination = new Nomination();
        nomination.id = json.id;
        nomination.title = json.title;
        nomination.image = image;

        if (json.scanner) {
            nomination.scanner = json.scanner;
        }

        if (json.status === umi.StatusCode.Pending) {
            nomination.status = umi.StatusCode.Pending;
        } else if (json.status === umi.StatusCode.Accepted) {
            nomination.status = umi.StatusCode.Accepted;
        } else {
            nomination.status = umi.StatusCode.Rejected;
            if (json.status !== umi.Reason.undeclared) {
                if (umi.reason.has(json.status)) {
                    nomination.reasons.push(json.status);
                }
            }
        }
        if (json.reasons) {
            for (const code of json.reasons) {
                if (umi.reason.has(code) && !nomination.reasons.includes(code)) {
                    nomination.reasons.push(code);
                }
            }
        }

        nomination.confirmedTime = json.confirmedTime > Nomination.timestampSecondBound ? json.confirmedTime : json.confirmedTime * 1000;
        nomination.confirmationMailId = json.confirmationMailId;

        if (json.resultTime) nomination.resultTime = json.resultTime > Nomination.timestampSecondBound ? json.resultTime : json.resultTime * 1000;
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
        return imgUrl.replace(/[^a-zA-Z0-9]/g, '').slice(-10).toLowerCase();
    }
}

/**
 * Callback for Array<Nomination>.filter()
 */
export type Predicator = (nomination: NominationData) => boolean;