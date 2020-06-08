import * as data from "../data/status.json";

class Status {

    code: number;
    title: string;
    icon: string;

    constructor(code: number, title: string, icon: string) {
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

    constructor(code: number, title: string, icon: string, query: MailQuery) {
        super(code, title, icon);
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

    constructor(code: number, title: string, icon: string, color: string, keyword: ReasonKeyword) {
        super(code, title, icon);
        this.color = color;
        this.keyword = keyword;
    }
}

class StatusKit {

    version: string;
    types: Map<string, StatusType>;
    reasons: Map<string, StatusReason>;

    constructor() {
        this.version = data.version;
        this.types = new Map();
        this.types.clear();
        for (const type of data.types) {
            this.types.set(type.key, new StatusType(
                type.code, type.title, type.icon,
                new MailQuery(type.query.redacted, type.query.prime)
            ));
        }
        this.reasons = new Map();
        this.reasons.clear();
        for (const reason of data.reasons) {
            this.reasons.set(reason.key, new StatusReason(
                reason.code, reason.title, reason.icon, reason.color,
                new ReasonKeyword(reason.keyword.redacted, reason.keyword.prime)
            ));
        }
    }

    matchStatus(code: number): Status {
        let result: Status = this.types.get('pending');
        if (code < 100) {
            if (code === 1) result = this.types.get('accepted');
        } else {
            for (const reason of this.reasons.values()) {
                if (reason.code === code) {
                    result = reason;
                    break; 
                }
            }
        }
        return result;
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