import data from 'data/status.json';

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
    export interface Scanner {
        readonly code: ScannerCode;
        readonly title: string;
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
    
        constructor(
            code: number, title: string, icon: string,
            queries: Map<ScannerCode, string>
        ) {
            this.code = code;
            this.title = title;
            this.icon = icon;

            this.queries = queries;
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
    
        constructor(
            code: number, title: string, icon: string,
            color: string, keyword: Map<ScannerCode, Array<string>>
        ) {
            this.code = code;
            this.title = title;
            this.icon = icon;

            this.color = color;
            this.keywords = keyword;
        }
    }
    
    export const scanner = data.scanners.reduce((map, scanner) => {
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
        if (json.oldCode) {
            map.set(json.oldCode, reason);
        }
        return map;
    }, new Map<ReasonCode, Reason>());
}