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
     * Basic information of all status
     */
    export class Status {
    
        readonly key: string;   // Key of the status
        readonly code: StatusCode | ReasonCode; // Code to identify the status and saved in file
        readonly title: string; // Title to display
        readonly icon: string;  // Icon to represent the status
    
        constructor(key: string, code: number, title: string, icon: string) {
            this.key = key;
            this.code = code;
            this.title = title;
            this.icon = icon;
        }
    
        get type(): string {
            if (this.code === 0) return 'pending';
            if (this.code === 1) return 'accepted';
            return 'rejected';
        }
    
        isType(type: number): boolean {
            if (type < 101) return this.code === type;
            return this.code > 100;
        }
    }
    
    /**
     * Information of types
     */
    export class StatusType extends Status {
    
        readonly queries: Map<ScannerCode, string>;  // Queries to search mails, <scanner, query>
    
        constructor(
            key: string, code: number, title: string, icon: string,
            queries: Map<ScannerCode, string>
        ) {
            super(key, code, title, icon);
            this.queries = queries;
        }
    }
    
    /**
     * Information of reject reasons
     */
    export class StatusReason extends Status {

        static undeclared: ReasonCode = 101;
        static duplicated: ReasonCode = 102;
        static close: ReasonCode = 103;
    
        readonly color: string; // Color to represent the reason in charts
        readonly keywords: Map<ScannerCode, Array<string>>;  // Keywords to identify the reason, <scanner, keywords>
    
        constructor(
            key: string, code: number, title: string, icon: string,
            color: string, keyword: Map<ScannerCode, Array<string>>
        ) {
            super(key, code, title, icon);
            this.color = color;
            this.keywords = keyword;
        }
    }
    
    export const scanner: Map<ScannerCode, Scanner> = data.scanners.reduce((map, scanner) => {
        map.set(scanner.code, scanner);
        return map;
    }, new Map());

    export const codes  : Map<number, Status>       = new Map();            // <code, status>
    export const types  : Map<string, StatusType>   = generateTypes();      // <key, type>
    export const reasons: Map<string, StatusReason> = generateReasons();    // <key, reason>

    function generateTypes() {

        const map = new Map<string, StatusType>();

        for (const value of data.statuses) {
            const status = new StatusType(
                value.key, value.code, value.title, value.iconFA,
                value.queries.reduce((map, query) => {
                    map.set(query.scanner, query.query);
                    return map;
                }, new Map<ScannerCode, string>())
            );
            map.set(status.key, status);
            codes.set(status.code, status);
        }

        return map;
    }

    function generateReasons() {

        const map = new Map<string, StatusReason>();

        for (const reason of data.reasons) {
            const status = new StatusReason(
                reason.key, reason.code, reason.title, reason.iconFA, reason.color,
                reason.keywords.reduce((map, keywords) => {
                    map.set(keywords.scanner, keywords.keywords);
                    return map;
                }, new Map<ScannerCode, Array<string>>())
            );
            map.set(reason.key, status);
            codes.set(reason.code, status);
        }

        return map;
    }
}