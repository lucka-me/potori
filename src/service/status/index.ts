import data from 'data/status.json';

/**
 * Basic information of all status
 */
export class Status {

    readonly key: string;   // Key of the status
    readonly code: number;  // Code to identify the status and saved in file
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

    readonly queries: Map<string, string>;  // Queries to search mails, <scanner, query>

    constructor(
        key: string, code: number, title: string, icon: string,
        queries: Map<string, string>
    ) {
        super(key, code, title, icon);
        this.queries = queries;
    }
}

/**
 * Information of reject reasons
 */
export class StatusReason extends Status {

    readonly color: string; // Color to represent the reason in charts
    readonly keywords: Map<string, Array<string>>;  // Keywords to identify the reason, <scanner, keywords>

    constructor(
        key: string, code: number, title: string, icon: string,
        color: string, keyword: Map<string, Array<string>>
    ) {
        super(key, code, title, icon);
        this.color = color;
        this.keywords = keyword;
    }
}

/**
 * Keep all status data
 */
export default class StatusKit {
    
    readonly types  : Map<string, StatusType>   = new Map();    // <key, type>
    readonly reasons: Map<string, StatusReason> = new Map();    // <key, reason>
    readonly codes  : Map<number, Status>       = new Map();    // <code, status>

    constructor() {
        for (const type of data.types) {
            const status = new StatusType(
                type.key, type.code, type.title, type.icon,
                new Map(type.queries as Array<[string, string]>)
            );
            this.types.set(type.key, status);
            this.codes.set(type.code, status);
        }

        for (const reason of data.reasons) {
            const status = new StatusReason(
                reason.key, reason.code, reason.title, reason.icon, reason.color,
                new Map(reason.keywords as Array<[string, Array<string>]>)
            );
            this.reasons.set(reason.key, status);
            this.codes.set(reason.code, status);
        }
    }
}