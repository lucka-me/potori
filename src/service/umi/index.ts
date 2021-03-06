import data from '@/data/umi/umi.json';
import { Predicator } from '@/service/nomination';

/**
 * Keep all status data
 */
export namespace umi {

    /**
     * Code to identify scanner
     */
    export enum ScannerCode {
        Unknown     = 0,
        Redacted    = 1,
        Prime       = 2,
    }
    
    /**
     * Scanner information
     */
    export class Scanner {
        readonly code: ScannerCode;
        readonly title: string;

        readonly predicator: Predicator;    // Predicator for filter

        constructor(code: ScannerCode, title: string) {
            this.code = code;
            this.title = title;
            this.predicator = (nomination) => nomination.scanner === this.code;
        }
    }

    /**
     * Code to identify status
     */
    export enum StatusCode {
        Pending     = 0,
        Accepted    = 1,
        Rejected    = 101,
    }

    /**
     * Code to identify reason
     */
    export type ReasonCode = number;
    
    /**
     * Status information
     */
    export class Status {

        readonly code: StatusCode; // Code to identify the status and saved in file
        readonly title: string; // Title to display
        readonly icon: string;  // Icon to represent the status
    
        readonly queries: Map<ScannerCode, string>;  // Queries to search mails, <scanner, query>

        readonly predicator: Predicator;    // Predicator for filter
    
        constructor(
            code: number, title: string, icon: string,
            queries: Map<ScannerCode, string>
        ) {
            this.code = code;
            this.title = title;
            this.icon = icon;

            this.queries = queries;
            this.predicator = (nomination) => nomination.status === this.code;
        }
    }
    
    /**
     * Reason information
     */
    export class Reason {

        static undeclared: ReasonCode = 101;
        static duplicated: ReasonCode = 102;
        static close: ReasonCode = 103;

        //readonly key: string;   // Key of the status
        readonly code: ReasonCode; // Code to identify the status and saved in file
        readonly title: string; // Title to display
        readonly icon: string;  // Icon to represent the status
    
        readonly color: string; // Color to represent the reason in charts
        readonly keywords: Map<ScannerCode, Array<string>>;  // Keywords to identify the reason, <scanner, keywords>

        readonly predicator: Predicator;    // Predicator for filter
    
        constructor(
            code: number, title: string, icon: string,
            color: string, keyword: Map<ScannerCode, Array<string>>
        ) {
            this.code = code;
            this.title = title;
            this.icon = icon;

            this.color = color;
            this.keywords = keyword;

            if (code === Reason.undeclared) {
                this.predicator = (nomination) => nomination.status === StatusCode.Rejected && nomination.reasons.length < 1;
            } else {
                this.predicator = (nomination) => nomination.status === StatusCode.Rejected && nomination.reasons.indexOf(code) > -1;
            }
        }
    }

    /**
     * Common type of `Scanner`, `Status` and `Reason`
     */
    export type CommonSense = Scanner | Status | Reason;
    
    export const scanner = data.scanners.reduce((map, json) => {
        const scanner = new Scanner(json.code, json.title);
        map.set(scanner.code, scanner);
        return map;
    }, new Map<ScannerCode, Scanner>());

    export const status = data.statuses.reduce((map, json) => {
        const status = new Status(
            json.code, json.title, json.iconFA,
            json.queries.reduce((quries, query) => {
                quries.set(query.scanner, query.query);
                return quries;
            }, new Map<ScannerCode, string>())
        );
        map.set(status.code, status);
        return map;
    }, new Map<StatusCode, Status>());

    export const reason = data.reasons.reduce((map, json) => {
        const reason = new Reason(
            json.code, json.title, json.iconFA, json.color,
            json.keywords.reduce((mapKeywords, keywords) => {
                mapKeywords.set(keywords.scanner, keywords.keywords);
                return mapKeywords;
            }, new Map<ScannerCode, Array<string>>())
        );
        map.set(reason.code, reason);
        return map;
    }, new Map<ReasonCode, Reason>());
}