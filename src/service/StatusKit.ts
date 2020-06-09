import * as data from "../data/status.json";

class Status {

    key: string;
    code: number;
    title: string;
    icon: string;

    constructor(key: string, code: number, title: string, icon: string) {
        this.key = key;
        this.code = code;
        this.title = title;
        this.icon = icon;
    }
}

class MailQuery {

    redacted: string;
    prime: string;

    constructor(redacted: string, prime: string) {
        this.redacted = redacted;
        this.prime = prime;
    }
}

class StatusType extends Status {

    query: MailQuery;

    constructor(key: string, code: number, title: string, icon: string, query: MailQuery) {
        super(key, code, title, icon);
        this.query = query;
    }
}

class ReasonKeyword {

    redacted: Array<string>;
    prime: Array<string>;

    constructor(redacted: Array<string>, prime: Array<string>) {
        this.redacted = redacted;
        this.prime = prime;
    }
}

class StatusReason extends Status {

    color: string;
    keyword: ReasonKeyword

    constructor(key: string, code: number, title: string, icon: string, color: string, keyword: ReasonKeyword) {
        super(key, code, title, icon);
        this.color = color;
        this.keyword = keyword;
    }
}

class StatusKit {

    version: string;
    
    types: Map<string, StatusType>;
    reasons: Map<string, StatusReason>;
    codes: Map<number, Status>;

    constructor() {
        this.version = data.version;

        this.codes = new Map();

        this.types = new Map();
        for (const type of data.types) {
            const status = new StatusType(
                type.key, type.code, type.title, type.icon,
                new MailQuery(type.query.redacted, type.query.prime)
            );
            this.types.set(type.key, status);
            this.codes.set(type.code, status);
        }

        this.reasons = new Map();
        for (const reason of data.reasons) {
            const status = new StatusReason(
                reason.key, reason.code, reason.title, reason.icon, reason.color,
                new ReasonKeyword(reason.keyword.redacted, reason.keyword.prime)
            );
            this.reasons.set(reason.key, status);
            this.codes.set(reason.code, status);
        }
    }

    typeMatched(status: number, type: number): boolean {
        if (type < 101) {
            return status === type;
        } else {
            return status > 100;
        }
    }
    
    getTypeByCode(code: number): string {
        if (code === 0) return 'pending';
        if (code === 1) return 'accepted';
        return 'rejected';
    }

    getReasonByCode(code: number): StatusReason {
        if (code < 100) return null;
        for (const value of this.reasons.values()) {
            if (value.code === code) return value;
        }
        return null;
    }
}

export default new StatusKit();
export { Status };